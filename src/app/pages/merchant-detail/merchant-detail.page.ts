import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {MerchantsService} from '../../services/merchants/merchants.service';
import {Merchant} from '../../models/merchant';
@Component({
    selector: 'app-merchant-detail',
    templateUrl: './merchant-detail.page.html',
    styleUrls: ['./merchant-detail.page.scss'],
})
export class MerchantDetailPage implements OnInit {
    doctor: string = "about";
    Short: string = "n1";
    merchant: Merchant;

    constructor(public navCtrl: NavController, public activatedRoute: ActivatedRoute, public merchantsServ: MerchantsService) {
        let merchantId = this.activatedRoute.snapshot.paramMap.get('objectId');
        this.getMerchant(merchantId);
    }
    
    getMerchant(merchantId) {
        this.merchantsServ.getMerchant(merchantId).subscribe((data: any) => {
            this.merchant = data;
        }, (err) => {
            console.log("Error getMerchant");
        });
    }

    addfeedback() {
        this.navCtrl.navigateForward('tabs/merchants/'+this.merchant.id+"/feedback");
    }
    appointmentbook() {
        this.navCtrl.navigateForward('tabs/merchants/'+this.merchant.id+"/booking");
    }

    ngOnInit() {
    }

}
