import {Component, OnInit} from '@angular/core';
import {BookingService} from '../../services/booking/booking.service';
import {NavController, LoadingController, ModalController} from '@ionic/angular';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {Booking} from '../../models/booking';
import {ApiService} from '../../services/api/api.service';
import {CartService} from '../../services/cart/cart.service';
import {OrderDataService} from '../../services/order-data/order-data.service';
import {CartPage} from '../cart/cart.page';
import {ActivatedRoute} from '@angular/router';
import {ParamsService} from '../../services/params/params.service';
@Component({
    selector: 'app-booking-detail',
    templateUrl: './booking-detail.page.html',
    styleUrls: ['./booking-detail.page.scss'],
})
export class BookingDetailPage implements OnInit {
    private mainBooking: Booking;
    constructor(public booking: BookingService,
        public activatedRoute: ActivatedRoute,
        public orderData: OrderDataService,
        public params: ParamsService,
        public cart: CartService,
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public api: ApiService,
        public loadingCtrl: LoadingController,
        public spinnerDialog: SpinnerDialog
    ) {}

    ngOnInit() {
        let params = this.params.getParams();
        this.mainBooking = params.booking;
    }
    cancelBooking() {
        this.showLoader();
        this.booking.cancelBookingObject(this.mainBooking.id).subscribe((data: any) => {
            let result = data.booking;
            result.starts_at = new Date(result.starts_at);
            result.ends_at = new Date(result.ends_at);
            this.mainBooking = new Booking(result);
            this.dismissLoader();
        }, (err) => {
            console.log("Error cancelBooking");
            this.dismissLoader();
            this.api.handleError(err);
        });
    }
    changeStatusBooking(status) {
        this.showLoader();
        let container = {"object_id": this.mainBooking.id, "status": status};
        this.booking.changeStatusBookingObject(container).subscribe((data: any) => {
            let result = data.booking;
            result.starts_at = new Date(result.starts_at);
            result.ends_at = new Date(result.ends_at);
            this.mainBooking = new Booking(result);
            this.dismissLoader();
        }, (err) => {
            console.log("Error cancelBooking");
            this.dismissLoader();
            this.api.handleError(err);
        });
    }
    dismissLoader() {
        if (document.URL.startsWith('http')) {
            this.loadingCtrl.dismiss();
        } else {
            this.spinnerDialog.hide();
        }
    }
    payBooking() {
        let extras = {
            "type":"Booking",
            "id":this.mainBooking.id,
            "name": "Booking appointment for: " + this.mainBooking.bookable.name,
        } 
        let item = {
            "name": "Booking appointment for: " + this.mainBooking.bookable.name,
            "price": this.mainBooking.price,
            "quantity": this.mainBooking.quantity,
            "tax": 0,
            "merchant_id":this.mainBooking.bookable.id,
            "cost": 0,
            "extras":extras
        };
        this.cart.addCustomCartItem(item).subscribe((data: any) => {
            this.orderData.cartData = data.cart;
            this.openCart();
        }, (err) => {
            console.log("Error addCustomCartItem");
            this.api.handleError(err);
        });
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
        if (data == "Checkout") {
            this.params.setParams({"merchant_id": 1});
            this.navCtrl.navigateForward('tabs/checkout/prepare');
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

}
