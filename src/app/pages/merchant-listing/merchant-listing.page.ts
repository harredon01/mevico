import {Component, OnInit} from '@angular/core';
import {NavController, ModalController} from '@ionic/angular';
import {SearchFilteringPage} from '../search-filtering/search-filtering.page';
import {MerchantDetailPage} from '../merchant-detail/merchant-detail.page';
import {MerchantsService} from '../../services/merchants/merchants.service';
import {Merchant} from '../../models/merchant';
@Component({
    selector: 'app-merchant-listing',
    templateUrl: './merchant-listing.page.html',
    styleUrls: ['./merchant-listing.page.scss'],
})
export class MerchantListingPage implements OnInit {
    location: string = "b1";
    category: string = "a1";
    merchants: Merchant[] = [];

    constructor(public navCtrl: NavController, public modalCtrl: ModalController, public merchantsServ: MerchantsService) {
        let where = "id>1290&order_by=id,asc";
        this.getMerchants(where);
    }
    async filter() {
        let container;
        container = {
            lat: "",
            long: "",
            address: "",
            id: "",
            phone: "",
            name: "",
            postal: "",
            notes: "",
            type: "billing"
        }
        let addModal = await this.modalCtrl.create({
            component: SearchFilteringPage,
            componentProps: container
        });
        await addModal.present();
        const {data} = await addModal.onDidDismiss();
        if (data) {
            this.getMerchants(data);
        }
    }
    getMerchants(where) {
        
        this.merchantsServ.getMerchants(where).subscribe((data: any) => {
            this.merchants = data.data;
        }, (err) => {
            console.log("Error getMerchantsFromServer");
        });
    }

    merchantDetail(merchantId:any) {
        this.navCtrl.navigateForward('tabs/categories/merchants/'+merchantId);
    }

    ngOnInit() {
    }

}
