import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavController, ToastController, LoadingController, AlertController,ModalController} from '@ionic/angular';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {ParamsService} from '../../services/params/params.service';
import {CartService} from '../../services/cart/cart.service';
import {ApiService} from '../../services/api/api.service';
import {OrderDataService} from '../../services/order-data/order-data.service';
import {Merchant} from '../../models/merchant';
import {CartPage} from '../cart/cart.page';
import {BookingService} from '../../services/booking/booking.service';
@Component({
    selector: 'app-booking',
    templateUrl: './booking.page.html',
    styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {
    availableDays: any[] = [];
    availableDates: Date[] = [];
    selectedSpots: any[] = [];
    availabilities: any[] = [];
    dateSelected: boolean = false;
    availabilitiesDate: any[] = [];
    weekday: any[] = [];
    typeObj: string;
    merchant: Merchant;
    notAvailable: string;
    success: string;
    objectId: string;
    selectedDate: Date;
    startDate: Date;
    endDate: Date;
    startDateS: any;
    amount: any = "1";
    submitted: boolean = false;

    constructor(public params: ParamsService, public booking: BookingService,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public api: ApiService,
        public orderData: OrderDataService,
        public modalCtrl: ModalController,
        public cart: CartService,
        public alertsCtrl: AlertController,
        public translateService: TranslateService,
        private spinnerDialog: SpinnerDialog) {
        this.weekday = new Array(7);
        this.weekday[0] = "sunday";
        this.weekday[1] = "monday";
        this.weekday[2] = "tuesday";
        this.weekday[3] = "wednesday";
        this.weekday[4] = "thursday";
        this.weekday[5] = "friday";
        this.weekday[6] = "saturday";
        let paramsArrived = this.params.getParams();
        this.merchant = paramsArrived.merchant;
        this.availabilities = paramsArrived.availabilities;
        console.log("Availabilities", this.availabilities);
        this.typeObj = paramsArrived.type;
        this.objectId = paramsArrived.objectId;
        this.getAvailableDates(this.availabilities);
        console.log("Get availableDays", this.availableDays);
        this.translateService.get('BOOKING.NOT_AVAILABLE').subscribe(function (value) {
            this.notAvailable = value;
        });
        this.translateService.get('BOOKING.SUCCESS').subscribe(function (value) {
            this.success = value;
        });
        this.getDates();
        console.log("Get availableDates", this.availableDates);
    }

    ngOnInit() {
    }
    createBooking() {
        if (this.submitted) {
            return true;
        }
        this.submitted = true;
        this.showLoader();
        let strDate = this.selectedDate.getFullYear() + "-" + (this.selectedDate.getMonth() + 1) + "-" + this.selectedDate.getDate() + " " + this.startDate.getHours() + ":" + this.startDate.getMinutes() + ":00";
        let ndDate = this.selectedDate.getFullYear() + "-" + (this.selectedDate.getMonth() + 1) + "-" + this.selectedDate.getDate() + " " + (this.startDate.getHours() + + parseInt(this.amount)) + ":" + this.startDate.getMinutes() + ":00";
        let data = {
            "type": this.typeObj,
            "object_id": this.objectId,
            "from": strDate,
            "to": ndDate
        };
        console.log("Start", this.startDate);
        console.log("data", data);
        this.booking.addBookingObject(data).subscribe((data: any) => {
            this.dismissLoader();

            this.submitted = false;
            //this.presentAlertConfirm(data);
            if (data.status == "success") {
                let booking = data.booking;
                let extras = {
                    "type":"Booking",
                    "id":booking.id,
                    "name": "Booking appointment for: " + booking.bookable.name,
                }
                let item = {
                    "name": "Booking appointment for: " + booking.bookable.name,
                    "price": booking.price,
                    "quantity": booking.quantity,
                    "tax": 0,
                    "merchant_id":this.objectId,
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
        }, (err) => {
            console.log("Error addBookingObject");
            this.dismissLoader();
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
        if (data == "Shipping") {
            this.params.setParams({"merchant_id": 1});
            this.navCtrl.navigateForward('tabs/checkout/shipping');
        }else if (data == "Prepare") {
            this.params.setParams({"merchant_id": 1});
            this.navCtrl.navigateForward('tabs/checkout/prepare');
        }
    }

    async presentAlertConfirm(resp: any) {
        let message = "";
        let button: any = {};
        if (resp.status == "success") {
            message = this.success;
            let button = {
                text: 'Ok',
                handler: () => {
                    this.navCtrl.back();
                }
            }
        } else {
            message = this.notAvailable;
            let button = {
                text: 'Ok',
                handler: () => {
                    console.log('Confirm Okay');
                }
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

    getAvailableDates(availabilities: any) {
        for (let item in availabilities) {
            let container = availabilities[item];
            if (!this.checkAvailableDays(container.range)) {
                this.availableDays.push(container.range);
            }
        }
    }

    checkAvailableDays(day: string) {
        for (let item in this.availableDays) {
            if (this.availableDays[item] == day) {
                return true;
            }
        }
        return false;
    }

    getDates() {
        var myDate = new Date();
        for (let i = 0; i < 31; i++) {
            let day = myDate.getDay();
            if (this.checkAvailableDays(this.weekday[day])) {
                let container = new Date(myDate.getTime());
                this.availableDates.push(container);
            }
            myDate.setDate(myDate.getDate() + 1);
        }
    }
    returnDates() {
        this.dateSelected = false;
    }
    selectStart() {
        this.startDate = new Date(this.startDateS);
        this.endDate = new Date(this.startDateS);
        this.endDate.setHours(this.startDate.getHours() + parseInt(this.amount));
    }
    selectDate(selectedDate: Date) {
        console.log("select date",selectedDate);
        this.showLoader();
        this.startDate = selectedDate;
        this.selectedDate = selectedDate;
        this.dateSelected = true;
        let strDate = selectedDate.getFullYear() + "-" + (selectedDate.getMonth() + 1) + "-" + selectedDate.getDate();
        let params = {
            "from": strDate,
            "query": "day",
            "type": this.typeObj,
            "object_id": this.objectId,
        };
        this.booking.getBookingsObject(params).subscribe((data: any) => {
            this.selectedSpots = data.data;
            this.dismissLoader();
        }, (err) => {
            console.log("Error addBookingObject");
            this.api.handleError(err);
        });
        let day = selectedDate.getDay();
        this.availabilitiesDate = [];
        for (let item in this.availabilities) {
            if (this.availabilities[item].range == this.weekday[day]) {
                this.availabilitiesDate.push((this.availabilities[item]));
            }
        }
        console.log("Availabilities", this.availabilitiesDate);
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
}
