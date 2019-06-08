import { Component, OnInit } from '@angular/core';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {ModalController, NavController, ToastController, Events, LoadingController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {OrderDataService} from '../../services/order-data/order-data.service';
import {Item} from '../../models/item';
import {CartService} from '../../services/cart/cart.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  currentItems: Item[];
    loading: any;
    // Our translated text strings
    private cartErrorString: string;
    private cartEmptyString: string;
    private cartUpdate: string;
    public totalItems: any;
    public subtotal: any;
    public total: any;

    constructor(public navCtrl: NavController,
        public cart: CartService,
        public events: Events,
        private spinnerDialog: SpinnerDialog,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public orderData: OrderDataService,
        public toastCtrl: ToastController,
        public translateService: TranslateService) {

        this.translateService.get('CART.ERROR_UPDATE').subscribe((value) => {
            this.cartErrorString = value;
        });
        this.translateService.get('CART.ERROR_EMPTY').subscribe((value) => {
            this.cartEmptyString = value;
        });
        this.translateService.get('CART.ITEM_UPDATED').subscribe((value) => {
            this.cartUpdate = value;
        })
        this.loadCart();

    }

    /**
     * The view loaded, let's query our items for the list
     */
    ionViewDidLoad() {
    }
    showLoader() {
        if (document.URL.startsWith('http')) {
            this.loading = this.loadingCtrl.create({
                spinner: 'crescent',
                backdropDismiss: true
            }).then(toast => toast.present());
        } else {
            this.spinnerDialog.show();
        }
    }

    reduceCartItem(item: any) {
        item.quantity--;
        this.addCartItem(item);

    }
    increaseCartItem(item: any) {
        item.quantity++;
        this.addCartItem(item);
    }
    cartUpdateMessage() {
        let toast = this.toastCtrl.create({
            message: this.cartUpdate,
            duration: 3000,
            position: 'top'
        }).then(toast => toast.present());
    }
    dismissLoader() {
        if (document.URL.startsWith('http')) {
            this.loadingCtrl.dismiss();
        } else {
            this.spinnerDialog.hide();
        }
    }
    handleCartSuccess(resp: any, item: any) {
        this.dismissLoader();
        this.orderData.cartData = resp.cart;
        if (resp.item) {
            item.inCart = true;
            item.item_id = resp.item.id;
            item.amount = resp.item.quantity;
        } else {
            item.inCart = false;
            item.item_id = null;
            item.amount = 1;
        }
        this.loadCart();
        this.cartUpdateMessage();
    }
    handleCartError(resp: any, item) {
        this.dismissLoader();
        console.log("Error", resp);
        let toast = this.toastCtrl.create({
            message: resp.message,
            duration: 3000,
            position: 'top'
        }).then(toast => toast.present());
    }
    handleServerCartError() {
        this.dismissLoader();
        //this.navCtrl.push(MainPage);
        // Unable to log in
        let toast = this.toastCtrl.create({
            message: this.cartErrorString,
            duration: 3000,
            position: 'top'
        }).then(toast => toast.present());
    }
    addCartItem(item: any) {
        this.showLoader();
        return new Promise((resolve, reject) => {
            let container = null;
            container = {
                product_variant_id: item.attributes.product_variant_id,
                quantity: item.quantity,
                item_id: item.item_id,
                merchant_id: item.attributes.merchant_id
            };
            console.log("Add cart item", container);
            if (container.item_id) {
                this.cart.updateCartItem(container).subscribe((resp: any) => {
                    console.log("updateCartItem", resp);
                    if (resp.status == "success") {
                        this.handleCartSuccess(resp, item);
                        if (resp.item) {
                            resolve(resp.item);
                        } else {
                            resolve(null);
                        }
                    } else {
                        this.dismissLoader();
                        this.handleCartError(resp, item);
                        resolve(null);
                    }

                }, (err) => {
                    this.handleServerCartError();
                    resolve(null);
                });
            } else {
                this.cart.addCartItem(container).subscribe((resp: any) => {
                    if (resp.status == "success") {
                        this.handleCartSuccess(resp, item);
                    } else {
                        this.dismissLoader();
                        this.handleCartError(resp, item);
                        resolve(null);
                    }
                    //this.navCtrl.push(MainPage);
                }, (err) => {
                    this.handleServerCartError();
                    resolve(null);
                });
            }
        });
    }

    /**
     * Delete an item from the list of cart.
     */
    deleteItem(item) {
        this.showLoader();
        item.quantity = 0;
        this.cart.updateCartItem(item).subscribe((resp: any) => {
            if (resp.status == "success") {
                this.orderData.cartData = resp.cart;
                this.loadCart();
                this.events.publish('cart:deleteItem', item, Date.now());
                //this.navCtrl.push(MainPage);
            }
            this.dismissLoader();
        }, (err) => {
            this.dismissLoader();
            //this.navCtrl.push(MainPage);
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.cartErrorString,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
        });
    }
    /**
     * Delete an item from the list of cart.
     */
    loadCart() {
        this.currentItems = [];
        if (this.orderData.cartData) {
            let cartContainer = this.orderData.cartData;
            console.log("cartContainer", cartContainer);
            let results = cartContainer.items;
            this.totalItems = cartContainer.totalItems;
            this.subtotal = cartContainer.subtotal;
            this.total = cartContainer.total;
            for (let index = 0; index < results.length; ++index) {
                console.log(results[index]);
                if (results[index].attributes.image) {
                    results[index].image = results[index].attributes.image.file;
                }
                results[index].item_id = results[index].id;
                let itemAdd = new Item(results[index]);
                this.currentItems.push(itemAdd);
            }
            console.log("Cart items", this.currentItems);
        } else {
            this.totalItems = 0;
            this.subtotal = 0;
            this.total = 0;
        }
    }
    /**
     * Delete an item from the list of cart.
     */
    clearCart() {
        this.showLoader();
        this.cart.clearCart().subscribe((resp) => {
            this.orderData.cartData = {};
            this.orderData.shippingAddress = null;
            this.orderData.cartData.items = [];
            this.orderData.cartData.total = 0;
            this.orderData.cartData.subtotal = 0;
            this.orderData.cartData.totalItems = 0;
            this.loadCart();
            this.dismissLoader();
            this.events.publish('cart:clear');
            //this.navCtrl.push(MainPage);
        }, (err) => {
            this.dismissLoader();
            //this.navCtrl.push(MainPage);
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.cartErrorString,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
        });
    }

    /**
     * Navigate to the detail page for this item.
     */
    checkout() {
        if (this.orderData.cartData.totalItems > 0) {
            this.modalCtrl.dismiss("Checkout");
        } else {
            let toast = this.toastCtrl.create({
                message: this.cartEmptyString,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
        }
    }

    /**
     * The user is done and wants to create the item, so return it
     * back to the presenter.
     */
    done() {
        this.modalCtrl.dismiss("Close");
    }

  ngOnInit() {
  }

}
