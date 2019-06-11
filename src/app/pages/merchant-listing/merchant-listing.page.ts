import {Component, OnInit} from '@angular/core';
import {NavController, ModalController} from '@ionic/angular';
import {SearchFilteringPage} from '../search-filtering/search-filtering.page';
import {MerchantDetailPage} from '../merchant-detail/merchant-detail.page';
@Component({
    selector: 'app-merchant-listing',
    templateUrl: './merchant-listing.page.html',
    styleUrls: ['./merchant-listing.page.scss'],
})
export class MerchantListingPage implements OnInit {
    location: string = "b1";
    category: string = "a1";

    constructor(public navCtrl: NavController, public modalCtrl: ModalController) {

    }
    filter() {
        //let modal = this.modalCtrl.create(SearchFilteringPage);
        //modal.present();
    }

    merchantDetail() {
        //this.navCtrl.push(MerchantDetailPage);
    }

    ngOnInit() {
    }

}
