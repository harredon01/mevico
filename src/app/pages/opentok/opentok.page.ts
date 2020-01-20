import {Component, OnInit} from '@angular/core';
import {NavController, ModalController,LoadingController} from '@ionic/angular';
import {ParamsService} from '../../services/params/params.service';
import {BookingService} from '../../services/booking/booking.service';
import {BookingDetailPage} from '../booking-detail/booking-detail.page';
import {Booking} from '../../models/booking';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
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
    mainBooking: Booking;
    sessionId: string;
    token: string;
    activeCall: boolean = false;

    constructor(public navCtrl: NavController,
        public modalCtrl: ModalController,
        public loadingCtrl: LoadingController,
        public spinnerDialog: SpinnerDialog,
        public params: ParamsService,
        public bookingS: BookingService) {
        this.apiKey = '46389642';
        this.sessionId = '';
        this.token = '';
        this.mainBooking = new Booking({});
    }
    ngOnInit() {
    }
    ionViewDidEnter() {
        let params = this.params.getParams();
        console.log("Call params", params);
        this.mainBooking = new Booking(params.booking);
        this.mainBooking.clean();
        this.sessionId = params.sessionId;
        this.token = params.token;
        this.bookingId = params.booking_id;
    }

    endCall() {
        this.session.disconnect();
        let container = {"booking_id": this.bookingId, "connection_id": this.session.connection.connectionId};
        this.bookingS.leaveCall(container).subscribe((resp: any) => {
            console.log("Register connection result", resp);

        }, (err) => {

        });
    }
    async viewNotes() {
        let container = {};
        let el = (document.querySelector('.OT_publisher') as HTMLElement);
        let el2 = (document.querySelector('.OT_subscriber') as HTMLElement);
        if (el) {
            el.style.setProperty('display', 'none');
        }
        if (el2) {
            el2.style.setProperty('display', 'none');
        }
        OT.updateViews();
        let params = this.params.getParams();
        if (!params) {
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
        if (el) {
            el.style.setProperty('display', 'block');
        }
        if (el2) {
            el2.style.setProperty('display', 'block');
        }
        OT.updateViews();
    }

    startCall() {
        this.activeCall = true;
        this.session = OT.initSession(this.apiKey, this.sessionId);
        console.log("Session started", this.session);
        let publisherOptions = {
            insertMode: 'append',
            width: 90,
            height: 120,
        };
        this.showLoader();
        this.publisher = OT.initPublisher('publisher', publisherOptions);
        OT.updateViews();
        this.session.on({
            streamCreated: (event: any) => {
                console.log('Stream created');
                let options = {width: "100%", height: '89%', insertMode: 'append'};
                this.session.subscribe(event.stream, 'subscriber', options);
                setTimeout(function () {OT.updateViews();}, 400);

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
                this.dismissLoader();
                let el = (document.querySelector('.OT_subscriber') as HTMLElement);
                if (el) {
                    el.style.setProperty('display', 'block');
                }
                //OT.updateViews();
                setTimeout(function () {OT.updateViews();}, 400);
            }
        });

        this.session.connect(this.token, (error: any) => {
            if (error) {
                console.log(`There was an error connecting to the session ${error}`);
            }
        });
    }
    showLoader() {
        if (document.URL.startsWith('http')) {
            this.loadingCtrl.create({
                spinner: 'crescent',
                backdropDismiss: true
            }).then(toast => toast.present());
        } else {
            this.spinnerDialog.show();
        }
    }
    dismissLoader() {
        if (document.URL.startsWith('http')) {
            this.loadingCtrl.dismiss();
        } else {
            this.spinnerDialog.hide();
        }
    }

}
