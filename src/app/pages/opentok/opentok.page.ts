import {Component, OnInit} from '@angular/core';
import {NavController,ModalController} from '@ionic/angular';
import {ParamsService} from '../../services/params/params.service';
import {BookingService} from '../../services/booking/booking.service';
import {BookingDetailPage} from '../booking-detail/booking-detail.page';
//import * as OT from '@opentok/client';
declare var OT: any;
@Component({
    selector: 'app-opentok',
    templateUrl: './opentok.page.html',
    styleUrls: ['./opentok.page.scss'],
})
export class OpentokPage implements OnInit {
    session: any;
    publisher: any;
    apiKey: any;
    bookingId: any;
    sessionId: string;
    token: string;
    activeCall:boolean = true;

    constructor(public navCtrl: NavController,
        public modalCtrl:ModalController,
        public params: ParamsService,
        public bookingS: BookingService) {
        this.apiKey = '46389642';
        this.sessionId = '';
        this.token = '';
    }
    ngOnInit() {
    }
    ionViewDidEnter() {
        let params = this.params.getParams();
        console.log("Call params", params);
        this.sessionId = params.sessionId;
        this.token = params.token;
        this.bookingId = params.booking_id;
    }
    
    endCall(){
        let container = {"booking_id": this.bookingId, "connection_id": this.session.connection.connectionId};
        this.bookingS.leaveCall(container).subscribe((resp: any) => {
                    console.log("Register connection result", resp);

                }, (err) => {

                });
    }
    async viewNotes() {
        let container = {};
        let params = this.params.getParams();
        if(!params){
            params = {};
        }
        params.modal = true;
        this.params.setParams(params);
        let addModal = await this.modalCtrl.create({
            component: BookingDetailPage,
            componentProps: container
        });
        await addModal.present();
        const {data} = await addModal.onDidDismiss();
        console.log("Modal Closed");
    }

    startCall() {
        console.log("Starting call",this.apiKey,this.sessionId)
        this.session = OT.initSession(this.apiKey, this.sessionId);
        console.log("Session started", this.session)

        this.publisher = OT.initPublisher('publisher');
        this.session.on({
            streamCreated: (event: any) => {
                console.log(`Stream created`);
                this.session.subscribe(event.stream, 'subscriber');

            },
            streamDestroyed: (event: any) => {
                console.log(`Stream ${event.stream.name} ended because ${event.reason}`);

            },
            connectionCreated: (event: any) => {
                console.log(`connectionCreated`);

            },
            connectionDestroyed: (event: any) => {
                console.log(`connection ended because ${event.reason}`);
            },
            sessionConnected: (event: any) => {
                let container = {"booking_id": this.bookingId, "connection_id": this.session.connection.connectionId};
                this.bookingS.registerConnection(container).subscribe((resp: any) => {
                    console.log("Register connection result", resp);

                }, (err) => {

                });
                this.session.publish(this.publisher);
            }
        });

        this.session.connect(this.token, (error: any) => {
            if (error) {
                console.log(`There was an error connecting to the session ${error}`);
            }
        });
    }

}
