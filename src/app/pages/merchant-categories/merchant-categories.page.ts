import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CategoriesService} from '../../services/categories/categories.service';
import {NavController, ModalController, ToastController, LoadingController,Events} from '@ionic/angular';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {CartService} from '../../services/cart/cart.service'
import {OrderDataService} from '../../services/order-data/order-data.service'
import {ParamsService} from '../../services/params/params.service';
import {UserDataService} from '../../services/user-data/user-data.service';
import {ApiService} from '../../services/api/api.service';
@Component({
    selector: 'app-merchant-categories',
    templateUrl: './merchant-categories.page.html',
    styleUrls: ['./merchant-categories.page.scss'],
})
export class MerchantCategoriesPage implements OnInit {
    location: string = "n1";
    categoriesErrorGet: string = "";
    items: any[];
    constructor(public navCtrl: NavController,
        public categories: CategoriesService,
        public params: ParamsService,
        public userData: UserDataService,
        public api: ApiService,
        public toastCtrl: ToastController,
        public modalCtrl: ModalController,
        public loadingCtrl: LoadingController,
        public translateService: TranslateService,
        public cartProvider: CartService,
        public orderData: OrderDataService,
        private spinnerDialog: SpinnerDialog,
        public events: Events) {}

    ngOnInit() {
        this.translateService.get('CATEGORIES.ERROR_GET').subscribe((value) => {
            this.categoriesErrorGet = value;
        });
        this.getCart();
        this.events.publish("authenticated");
        this.events.subscribe('cart:orderFinished', () => {
            this.clearCart(); 
            // user and time are the same arguments passed in `events.publish(user, time)`
        });
        this.getItems();
    }
    /**
       * Navigate to the detail page for this item.
       */
    getItems() {
        this.showLoader();
        let query = "merchants";
        this.categories.getCategories(query).subscribe((data: any) => {
            this.dismissLoader();
            console.log("after getCategories");
            this.items = data.categories;
            console.log(JSON.stringify(data));
        }, (err) => {
            this.dismissLoader();
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.categoriesErrorGet,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
            this.api.handleError(err);
        });
    }
    /**
     * Navigate to the detail page for this item.
     */
    openItem(item: any) {
        this.params.setParams({"item":item});
        this.navCtrl.navigateForward('tabs/categories/'+item.id); 
    }
    searchItems(ev: any) {
        // set val to the value of the searchbar
        const val = ev.target.value;
        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {

        }
    }
    dismissLoader() {
        if (document.URL.startsWith('http')) {
            this.loadingCtrl.dismiss();
        } else {
            this.spinnerDialog.hide();
        }
    }
    showLoader() {
        if (document.URL.startsWith('http')) {
            this.loadingCtrl.create({
                spinner: 'crescent',
                backdropDismiss: true
            }).then(toast => toast.present());
        } else {
            this.spinnerDialog.show(null, this.categoriesErrorGet);
        }
    }
    getCart() {
        this.cartProvider.getCheckoutCart().subscribe((resp) => {
            if (resp) {
                console.log("getCart", resp);
                this.orderData.cartData = resp;
            }
        }, (err) => {
            console.log("getCartError", err);
            this.orderData.cartData = null;
            this.api.handleError(err);
        });
    }
    clearCart() {
        this.cartProvider.clearCart().subscribe((resp) => {
            if (resp) {
                console.log("clearCart", resp);
                this.orderData.cartData = null;
            }
        }, (err) => {
            console.log("clearCart", err);
            this.orderData.cartData = null;
            this.api.handleError(err);
        });
    }

}
