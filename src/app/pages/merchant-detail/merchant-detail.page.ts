import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {MerchantsService} from '../../services/merchants/merchants.service';
import {ParamsService} from '../../services/params/params.service';
import {Merchant} from '../../models/merchant';
import {ApiService} from '../../services/api/api.service';
@Component({
    selector: 'app-merchant-detail',
    templateUrl: './merchant-detail.page.html',
    styleUrls: ['./merchant-detail.page.scss'],
})
export class MerchantDetailPage implements OnInit {
    doctor: string = "about";
    Short: string = "n1";
    category: string = "";
    merchant: Merchant;

    constructor(public navCtrl: NavController, public activatedRoute: ActivatedRoute,public api: ApiService, public merchantsServ: MerchantsService, public params: ParamsService) {
        let merchantId = this.activatedRoute.snapshot.paramMap.get('objectId');
        this.merchant = new Merchant({"availabilities":[]});
        this.getMerchant(merchantId);
    }
    
    getMerchant(merchantId) {
        this.merchantsServ.getMerchant(merchantId).subscribe((data: any) => {
            let container = data.merchant;
            container.availabilities = data.availabilities;
            container.ratings = data.ratings;
            container.files = data.files;
            this.merchant = new Merchant(container);
        }, (err) => {
            console.log("Error getMerchant");
            this.api.handleError(err);
        });
    }

    addfeedback() {
        let params = {
            "type": "Merchant",
            "objectId": this.merchant.id
        };
        this.params.setParams(params);
        let category = this.activatedRoute.snapshot.paramMap.get('categoryId');
        
        this.navCtrl.navigateForward('tabs/categories/'+category+'/merchant/'+this.merchant.id+"/ratings");
    }
    myBookings() {
        let params = {
            "type": "Merchant",
            "objectId": this.merchant.id,
            "target":"bookable"
        };
        this.params.setParams(params);
        let category = this.activatedRoute.snapshot.paramMap.get('categoryId');
        
        this.navCtrl.navigateForward('tabs/categories/'+category+'/merchant/'+this.merchant.id+"/bookings");
    }
    showProducts() {
        let params = {
            "type": "Merchant",
            "objectId": this.merchant.id
        };
        this.params.setParams(params);
        let category = this.activatedRoute.snapshot.paramMap.get('categoryId');
        this.navCtrl.navigateForward('tabs/categories/'+category+'/merchant/'+this.merchant.id+"/products");
    }
    appointmentbook() {
        let params = {
            "availabilities": this.merchant.availabilities,
            "type": "Merchant",
            "objectId": this.merchant.id
        }
        this.params.setParams(params);
        let category = this.activatedRoute.snapshot.paramMap.get('categoryId');
        this.navCtrl.navigateForward('tabs/categories/'+category+'/merchant/'+this.merchant.id+"/bookings");
    }
    
    ngOnInit() {
    }

}
