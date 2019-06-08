import {Component, OnInit} from '@angular/core';
import {NavController, Events} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {ParamsService} from '../../services/params/params.service';
@Component({
    selector: 'app-payu-complete',
    templateUrl: './payu-complete.page.html',
    styleUrls: ['./payu-complete.page.scss'],
})
export class PayuCompletePage implements OnInit {

    // The account fields for the login form.
    // If you're using the username field with or without email, make
    // sure to add it to the type
    transaction: any;

    constructor(public navCtrl: NavController,
        public params: ParamsService,
        public events: Events,
        public translateService: TranslateService) {
        let paramsSent = this.params.getParams();
        this.transaction = paramsSent.transaction;
        if (this.transaction.operationDate) {
            this.transaction.operationDate = new Date(this.transaction.operationDate);
        }
        if (this.transaction.state == 'APPROVED') {
            let vm = this;
            setTimeout(function () {vm.events.publish("home:loadDeliveries");}, 1500);
        }
    }

    /**
       * The view loaded, let's query our items for the list
       */
    ionViewDidEnter() {

    }
    /**
       * The view loaded, let's query our items for the list
       */
    returnHome() {
        this.navCtrl.navigateRoot("tabs");
    }

    ngOnInit() {
    }

}
