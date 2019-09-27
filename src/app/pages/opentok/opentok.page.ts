import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {ParamsService} from '../../services/params/params.service';
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
    sessionId: string;
    token: string;

    constructor(public navCtrl: NavController, public params: ParamsService) {
        this.apiKey = '';
        this.sessionId = '';
        this.token = '';
    }
    ngOnInit() {
    }
    ngOnLoad() {
        let params = this.params.getParams();
        this.apiKey = params.apiKey;
        this.sessionId = params.sessionId;
        this.token = params.token;
    }

    startCall() {
        this.session = OT.initSession(this.apiKey, this.sessionId);
        this.publisher = OT.initPublisher('publisher');

        this.session.on({
            streamCreated: (event: any) => {
                this.session.subscribe(event.stream, 'subscriber');
                OT.updateViews();
            },
            streamDestroyed: (event: any) => {
                console.log(`Stream ${event.stream.name} ended because ${event.reason}`);
                OT.updateViews();
            },
            sessionConnected: (event: any) => {
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
