import {Component, OnInit} from '@angular/core';
import {NavController, ModalController, LoadingController, AlertController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {MerchantsService} from '../../services/merchants/merchants.service';
import {ParamsService} from '../../services/params/params.service';
import {OrderDataService} from '../../services/order-data/order-data.service';
import {Merchant} from '../../models/merchant';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {CartPage} from '../cart/cart.page';
import {ApiService} from '../../services/api/api.service';
import {UserDataService} from '../../services/user-data/user-data.service'
import {BookingService} from '../../services/booking/booking.service'
import {CartService} from '../../services/cart/cart.service'
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
    notAvailable: string;
    maxReached: string;
    requiresAuth: string;
    success: string;

    constructor(public navCtrl: NavController,
        public modalCtrl: ModalController,
        public alertsCtrl: AlertController,
        public orderData: OrderDataService,
        public activatedRoute: ActivatedRoute,
        public api: ApiService,
        public cart: CartService,
        public booking: BookingService,
        public spinnerDialog: SpinnerDialog,
        public translateService: TranslateService,
        public loadingCtrl: LoadingController,
        public userData: UserDataService,
        public merchantsServ: MerchantsService,
        public params: ParamsService) {
        let merchantId = this.activatedRoute.snapshot.paramMap.get('objectId');
        let theParams = this.params.getParams();
        if (theParams.owner) {
            this.urlSearch = "tabs/settings/merchants/" + merchantId;
            this.fromSettings = true;
        } else {
            let category = this.activatedRoute.snapshot.paramMap.get('categoryId');
            this.urlSearch = 'tabs/categories/' + category + '/merchant/' + merchantId;
        }
        let vm = this
        this.translateService.get('BOOKING.REQUIRES_AUTH').subscribe(function (value) {
            console.log("Req", value);
            vm.requiresAuth = value;
        });
        this.translateService.get('BOOKING.NOT_AVAILABLE').subscribe(function (value) {
            vm.notAvailable = value;
            console.log("afk", value);
        });
        this.translateService.get('BOOKING.MAX_REACHED').subscribe(function (value) {
            vm.maxReached = value;
            console.log("afk", value);
        });
        this.translateService.get('BOOKING.SUCCESS').subscribe(function (value) {
            vm.success = value;
        });

        this.merchant = new Merchant({"availabilities": [], "attributes": [], "files": []});
        this.getMerchant(merchantId);
    }
    async presentAlertConfirm(message) {
        console.log("Present alert", message);
        let button = {
            text: 'Ok',
            handler: () => {
                console.log('Confirm Okay');
            }
        }
        const alert = await this.alertsCtrl.create({
            message: message,
            buttons: [
                button
            ]
        });
        await alert.present();
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
            this.navCtrl.navigateForward('tabs/checkout/shipping/' + this.merchant.id);
        } else if (data == "Prepare") {
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
            if (container.user_id == this.userData._user.id) {
                container.owner = true;
            }
            this.merchant = new Merchant(container);
            console.log("attributes", this.merchant.attributes);
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
        if (this.fromSettings) {
            params["settings"] = true;
        }
        this.params.setParams(params);
        this.navCtrl.navigateForward(this.urlSearch + "/ratings");
    }
    chat() {
        let params = {
            "type": "Merchant",
            "objectId": this.merchant.id,
            "name": this.merchant.name
        };
        if (this.fromSettings) {
            params["settings"] = true;
        }
        this.params.setParams(params);
        this.navCtrl.navigateForward(this.urlSearch + "/chat");
    }
    myBookings() {
        let params = {
            "type": "Merchant",
            "objectId": this.merchant.id,
            "target": "bookable",
            "objectName": this.merchant.name,
            "objectDescription": this.merchant.description,
            "objectIcon": this.merchant.src
        };
        if (this.fromSettings) {
            params["settings"] = true;
        }
        this.params.setParams(params);
        this.navCtrl.navigateForward(this.urlSearch + "/bookings");
    }
    myItems() {
        let params = {
            "merchant": this.merchant.id
        };
        if (this.fromSettings) {
            params["settings"] = true;
        }
        this.params.setParams(params);
        this.navCtrl.navigateForward(this.urlSearch + "/items");
    }
    myImages() {
        let icon = this.merchant.icon;
        if (!icon) {
            icon = "https://gohife.s3.us-east-2.amazonaws.com/public/icons/avatar.png";
        }
        let params = {
            "objectId": this.merchant.id,
            "type": "Merchant",
            "Name": this.merchant.name,
            "icon": icon
        };
        if (this.fromSettings) {
            params["settings"] = true;
        }
        this.params.setParams(params);
        this.navCtrl.navigateForward(this.urlSearch + "/images");
    }
    myAvailabilities() {
        let params = {
            "merchant": this.merchant.id
        };
        if (this.fromSettings) {
            params["settings"] = true;
        }
        this.params.setParams(params);
        this.navCtrl.navigateForward(this.urlSearch + "/availabilities");
    }
    editMerchant() {
        let params = {
            "merchant": this.merchant
        };
        if (this.fromSettings) {
            params["settings"] = true;
        }
        this.params.setParams(params);
        this.navCtrl.navigateForward(this.urlSearch + "/edit");
    }
    ionViewDidEnter() {
        let container = this.params.getParams();
        if (container.hasChanged) {
            this.getMerchant(this.merchant.id);
        }
    }
    showProducts() {
        let params = {
            "type": "Merchant",
            "objectId": this.merchant.id,
            "owner": this.merchant.owner
        };
        if (this.fromSettings) {
            params["settings"] = true;
        }
        this.params.setParams(params);
        this.navCtrl.navigateForward(this.urlSearch + "/products");
    }
    appointmentbook() {
        let params = {
            "availabilities": this.merchant.availabilities,
            "type": "Merchant",
            "objectId": this.merchant.id
        }
        if (this.fromSettings) {
            params["settings"] = true;
        }
        this.params.setParams(params);
        this.navCtrl.navigateForward(this.urlSearch + "/book");
    }
    call() {
        this.showLoader();
        let attrs = {};
        attrs["location"] = "opentok";
        let data = {
            "type": "Merchant",
            "object_id": this.merchant.id,
            "attributes": attrs
        };
        this.booking.immediateBookingObject(data).subscribe((resp: any) => {
            this.dismissLoader();
            console.log("addBookingObject", resp);
            //this.presentAlertConfirm(data);
            if (resp.status == "success") {
                let booking = resp.booking;
                let extras = {
                    "type": "Booking",
                    "id": booking.id,
                    "name": "Booking appointment for: " + booking.bookable.name,
                }
                let item = {
                    "name": "Booking appointment for: " + booking.bookable.name,
                    "price": booking.price,
                    "quantity": booking.quantity,
                    "tax": 0,
                    "merchant_id": this.merchant.id,
                    "cost": 0,
                    "extras": extras
                };
                this.cart.addCustomCartItem(item).subscribe((data: any) => {
                    this.orderData.cartData = data.cart;
                    this.openCart();
                }, (err) => {
                    console.log("Error addCustomCartItem");
                    this.api.handleError(err);
                });
            } else {
                if (resp.message == "Not Available") {
                    this.presentAlertConfirm(this.notAvailable);
                }
                if (resp.message == "Max Reached") {
                    this.presentAlertConfirm(this.maxReached);
                }
            }
        }, (err) => {
            console.log("Error addBookingObject");
            this.dismissLoader();
            this.api.handleError(err);
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

    ngOnInit() {
    }

}
