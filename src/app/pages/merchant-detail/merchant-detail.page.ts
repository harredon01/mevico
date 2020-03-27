import {Component, OnInit, ViewChild} from '@angular/core';
import {NavController, ModalController, LoadingController, AlertController, IonSlides} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {MerchantsService} from '../../services/merchants/merchants.service';
import {ParamsService} from '../../services/params/params.service';
import {OrderDataService} from '../../services/order-data/order-data.service';
import {Merchant} from '../../models/merchant';
import {DynamicRouterService} from '../../services/dynamic-router/dynamic-router.service';
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
    @ViewChild('slides', {static: false}) slides: IonSlides;
    doctor: string = "about";
    Short: string = "n1";
    category: string = "";
    urlSearch: string = "";
    fromSettings: boolean = false;
    merchant: Merchant;
    notAvailable: string;
    maxReached: string;
    galPage: any = 1;
    requiresAuth: string;
    success: string;

    constructor(public navCtrl: NavController,
        public modalCtrl: ModalController,
        public alertsCtrl: AlertController,
        public orderData: OrderDataService,
        public activatedRoute: ActivatedRoute,
        public api: ApiService,
        private drouter: DynamicRouterService,
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
        let category = this.activatedRoute.snapshot.paramMap.get('categoryId');
        if (this.userData._user) {
            this.urlSearch = 'tabs/categories/' + category + '/merchant/' + merchantId;
        } else {
            this.urlSearch = 'home/' + category + '/merchant/' + merchantId;
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
        this.params.setParams({"merchant_id": this.merchant.id});
        if (data == "Shipping") {
            this.navCtrl.navigateForward('tabs/checkout/shipping/' + this.merchant.id);
        } else if (data == "Prepare") {
            this.navCtrl.navigateForward('tabs/checkout/prepare');
        }
    }

    getMerchant(merchantId) {
        this.merchantsServ.getMerchant(merchantId).subscribe((data: any) => {
            let container = data.merchant;
            container.availabilities = data.availabilities;
            container.ratings = data.ratings;
            container.files = data.files;
            this.merchant = new Merchant(container);
            console.log("attributes", this.merchant.attributes);
        }, (err) => {
            console.log("Error getMerchant");
            this.api.handleError(err);
        });
    }

    chat() {
        let params = {
            "type": "Merchant",
            "objectId": this.merchant.id,
            "name": this.merchant.name
        };
        this.params.setParams(params);
        this.navCtrl.navigateForward(this.urlSearch + "/chat");
    }
    ionViewDidEnter() {
        let container = this.params.getParams();
        if (container.hasChanged) {
            this.getMerchant(this.merchant.id);
        }
    }
    slidePrev() {
        this.galPage--;
        this.slides.slidePrev();
    }
    slideNext() {
        this.galPage++;
        this.slides.slideNext();
    }
    showProducts() {
        let params = {
            "type": "Merchant",
            "objectId": this.merchant.id,
            "owner": this.merchant.owner
        };
        this.params.setParams(params);
        this.navCtrl.navigateForward(this.urlSearch + "/products");
    }
    appointmentbook() {
        let params = {
            "availabilities": this.merchant.availabilities,
            "type": "Merchant",
            "objectId": this.merchant.id,
            "objectName": this.merchant.name,
            "objectDescription": this.merchant.description,
            "objectIcon": this.merchant.icon
        }
        console.log(params);
        this.params.setParams(params);
        this.navCtrl.navigateForward(this.urlSearch + "/book");
    }
    addBookingToCart(booking: any) {
        let extras = {
            "type": "Booking",
            "id": booking.id,
            "call": true,
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
    }
    call() {
        this.showLoader();
        let attrs = {"location":"opentok"};
        let data = {
            "type": "Merchant",
            "object_id": this.merchant.id,
            "attributes": attrs
        };
        if (this.userData._user) {
            this.booking.immediateBookingObject(data).subscribe((resp: any) => {
                this.dismissLoader();
                console.log("addBookingObject", resp);
                //this.presentAlertConfirm(data);
                if (resp.status == "success") {
                    this.addBookingToCart(resp.booking);
                } else {
                    if (resp.message == "Not available") {
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
        } else {
            
        }

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
