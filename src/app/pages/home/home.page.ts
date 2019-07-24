import {Component, OnInit} from '@angular/core';
import {CartService} from '../../services/cart/cart.service'
import {OrderDataService} from '../../services/order-data/order-data.service'
import {NavController, ToastController, Events, LoadingController} from '@ionic/angular';
import {ApiService} from '../../services/api/api.service'
@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    constructor(public cartProvider: CartService,
        public orderData: OrderDataService,
        public api: ApiService,
        public events: Events) {}

    ngOnInit() {
        this.getCart();
        this.events.publish("authenticated");
        this.events.subscribe('cart:orderFinished', () => {
            this.clearCart(); 
            // user and time are the same arguments passed in `events.publish(user, time)`
        });
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
