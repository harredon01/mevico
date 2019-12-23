import {Component, OnInit} from '@angular/core';
import {NavController,ModalController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {MerchantsService} from '../../services/merchants/merchants.service';
import {ParamsService} from '../../services/params/params.service';
import {OrderDataService} from '../../services/order-data/order-data.service';
import {Merchant} from '../../models/merchant';
import {CartPage} from '../cart/cart.page';
import {ApiService} from '../../services/api/api.service';
import {UserDataService} from '../../services/user-data/user-data.service'
@Component({
    selector: 'app-merchant-detail',
    templateUrl: './merchant-detail.page.html',
    styleUrls: ['./merchant-detail.page.scss'],
})
export class MerchantDetailPage implements OnInit {
    doctor: string = "about";
    Short: string = "n1";
    category: string = "";
    urlSearch: string = "";
    fromSettings: boolean = false;
    merchant: Merchant;

    constructor(public navCtrl: NavController, 
    public modalCtrl: ModalController, 
    public orderData: OrderDataService, 
        public activatedRoute: ActivatedRoute,
        public api: ApiService, 
        public userData: UserDataService, 
        public merchantsServ: MerchantsService, 
        public params: ParamsService) {
        let merchantId = this.activatedRoute.snapshot.paramMap.get('objectId');
        let theParams = this.params.getParams();
        if(theParams.owner){
            this.urlSearch = "tabs/settings/merchants/"+merchantId;
            this.fromSettings = true;
        } else {
            let category = this.activatedRoute.snapshot.paramMap.get('categoryId');
            this.urlSearch = 'tabs/categories/'+category+'/merchant/'+merchantId;
        }
        
        this.merchant = new Merchant({"availabilities":[],"attributes":[]});
        this.getMerchant(merchantId);
    }
    async openCart() {
        let container = {cart: this.orderData.cartData};
        console.log("Opening Cart", container);
        let addModal = await this.modalCtrl.create({
            component: CartPage,
            componentProps: container
        });
        await addModal.present();
        const {data} = await addModal.onDidDismiss();
        if (data == "Shipping") {
            this.params.setParams({"merchant_id": this.merchant.id});
            this.navCtrl.navigateForward('tabs/checkout/shipping/'+this.merchant.id);
        }else if (data == "Prepare") {
            this.params.setParams({"merchant_id": this.merchant.id});
            this.navCtrl.navigateForward('tabs/checkout/prepare');
        }
    }
    
    getMerchant(merchantId) {
        this.merchantsServ.getMerchant(merchantId).subscribe((data: any) => {
            let container = data.merchant;
            container.availabilities = data.availabilities;
            container.ratings = data.ratings;
            container.files = data.files;
            if (container.user_id == this.userData._user.id){
                container.owner = true;
            }
            this.merchant = new Merchant(container);
            console.log("attributes",this.merchant.attributes);
        }, (err) => {
            console.log("Error getMerchant");
            this.api.handleError(err);
        });
    }

    addfeedback() {
        let params = {
            "type": "Merchant",
            "objectId": this.merchant.id,
            "name": this.merchant.name
        };
        if (this.fromSettings){
            params["settings"] = true;
        }
        this.params.setParams(params);
        this.navCtrl.navigateForward(this.urlSearch+"/ratings");
    }
    chat() {
        let params = {
            "type": "Merchant",
            "objectId": this.merchant.id,
            "name": this.merchant.name
        };
        if (this.fromSettings){
            params["settings"] = true;
        }
        this.params.setParams(params);
        this.navCtrl.navigateForward(this.urlSearch+"/chat");
    }
    myBookings() {
        let params = {
            "type": "Merchant",
            "objectId": this.merchant.id,
            "target":"bookable",
            "objectName": this.merchant.name,
            "objectDescription": this.merchant.description,
            "objectIcon": this.merchant.src
        };
        if (this.fromSettings){
            params["settings"] = true;
        }
        this.params.setParams(params);
        this.navCtrl.navigateForward(this.urlSearch+"/bookings");
    }
    myItems() {
        let params = {
            "merchant": this.merchant.id
        };
        if (this.fromSettings){
            params["settings"] = true;
        }
        this.params.setParams(params);
        this.navCtrl.navigateForward(this.urlSearch+"/items");
    }
    myImages() {
        let params = {
            "objectId": this.merchant.id,
            "type":"Merchant",
            "Name":this.merchant.name
        };
        if (this.fromSettings){
            params["settings"] = true;
        }
        this.params.setParams(params);
        this.navCtrl.navigateForward(this.urlSearch+"/images");
    }
    myAvailabilities() {
        let params = {
            "merchant": this.merchant.id
        };
        if (this.fromSettings){
            params["settings"] = true;
        }
        this.params.setParams(params);
        this.navCtrl.navigateForward(this.urlSearch+"/availabilities");
    }
    editMerchant() {
        let params = {
            "merchant": this.merchant
        };
        if (this.fromSettings){
            params["settings"] = true;
        }
        this.params.setParams(params);
        this.navCtrl.navigateForward(this.urlSearch+"/edit");
    }
    ionViewDidEnter() {
        let container = this.params.getParams();
        if(container.hasChanged){
            this.getMerchant(this.merchant.id);
        }
    }
    showProducts() {
        let params = {
            "type": "Merchant",
            "objectId": this.merchant.id,
            "owner": this.merchant.owner
        };
        if (this.fromSettings){
            params["settings"] = true;
        }
        this.params.setParams(params);
        this.navCtrl.navigateForward(this.urlSearch+"/products");
    }
    appointmentbook() {
        let params = {
            "availabilities": this.merchant.availabilities,
            "type": "Merchant",
            "objectId": this.merchant.id
        }
        if (this.fromSettings){
            params["settings"] = true;
        }
        this.params.setParams(params);
        this.navCtrl.navigateForward(this.urlSearch+"/book");
    }
    
    ngOnInit() {
    }

}
