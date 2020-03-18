import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavController, ToastController, LoadingController, AlertController, ModalController} from '@ionic/angular';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {ParamsService} from '../../services/params/params.service';
import {CartService} from '../../services/cart/cart.service';
import {ApiService} from '../../services/api/api.service';
import {OrderDataService} from '../../services/order-data/order-data.service';
import {Booking} from '../../models/booking';
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
    months: any[] = [];
    dateSelected: boolean = false;
    timeSelected: boolean = false;
    availabilitiesDate: any[] = [];
    weekday: any[] = [];
    typeObj: string;
    bookingObj:Booking = null;
    notAvailable: string;
    maxReached: string;
    requiresAuth: string;
    success: string;
    atributesCont: any;
    objectId: string;
    objectName: string;
    objectDescription: string;
    objectIcon: string;
    selectedDate: Date;
    startDate: Date;
    endDate: Date;
    startDateS: any;
    activeBooking: any;
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
        this.atributesCont = {};
        this.weekday = new Array(7);
        this.weekday[0] = "sunday";
        this.weekday[1] = "monday";
        this.weekday[2] = "tuesday";
        this.weekday[3] = "wednesday";
        this.weekday[4] = "thursday";
        this.weekday[5] = "friday";
        this.weekday[6] = "saturday";

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

        console.log("Get availableDates", this.availableDates);
    }

    ngOnInit() {
        this.loadData();
    }
    loadData() {
        let paramsArrived = this.params.getParams();
        this.typeObj = paramsArrived.type;
        this.objectId = paramsArrived.objectId;
        this.objectName = paramsArrived.objectName;
        this.objectDescription = paramsArrived.objectDescription;
        this.objectIcon = paramsArrived.objectIcon;
        if(paramsArrived.booking){
            this.bookingObj = paramsArrived.booking;
        }
        if (paramsArrived.availabilities) {
            this.availabilities = paramsArrived.availabilities;
            console.log("Availabilities", this.availabilities);
            this.getAvailableDates(this.availabilities);
            this.getDates();
            console.log("Get availableDays", this.availableDays);
        } else {
            this.getItems();
        }
    }
    setOrder(item) {
        if (item.range == 'sunday') {
            item.order = 0;
        }
        if (item.range == 'monday') {
            item.order = 1;
        }
        if (item.range == 'tuesday') {
            item.order = 2;
        }
        if (item.range == 'wednesday') {
            item.order = 3;
        }
        if (item.range == 'thursday') {
            item.order = 4;
        }
        if (item.range == 'friday') {
            item.order = 5;
        }
        if (item.range == 'saturday') {
            item.order = 6;
        }
        return item;
    }
    getItems() {
        let availabilities: any[] = [];
        let where = {"type": "Merchant", "object_id": this.objectId};
        this.booking.getAvailabilitiesObject(where).subscribe((data: any) => {
            this.dismissLoader();
            console.log("after getItems", data);
            let results = data.data;
            for (let one in results) {
                results[one] = this.setOrder(results[one]);
                availabilities.push(results[one]);
            }
            availabilities.sort((a, b) => (a.order > b.order) ? 1 : -1);
            this.availabilities = availabilities;
            console.log("Availabilities", this.availabilities);
            this.getAvailableDates(this.availabilities);
            this.getDates();
            console.log("Get availableDays", this.availableDays);
            console.log(JSON.stringify(data));
        }, (err) => {
            this.dismissLoader();
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: "ERROR",
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
            this.api.handleError(err);
        });
    }
    goBack() {
        console.log("goBack", this.dateSelected)
        if (this.dateSelected) {
            this.dateSelected = false;
        } else {
            this.navCtrl.back();
        }

    }
    createBooking() {
        if (this.submitted) {
            return true;
        }
        this.submitted = true;
        this.showLoader();
        let strDate = this.selectedDate.getFullYear() + "-" + (this.selectedDate.getMonth() + 1) + "-" + this.selectedDate.getDate() + " " + this.startDate.getHours() + ":" + this.startDate.getMinutes() + ":00";
        let ndDate = this.selectedDate.getFullYear() + "-" + (this.selectedDate.getMonth() + 1) + "-" + this.selectedDate.getDate() + " " + (this.startDate.getHours() + + parseInt(this.amount)) + ":" + this.startDate.getMinutes() + ":00";
        this.atributesCont.location = "opentok";
        let data = {
            "type": this.typeObj,
            "object_id": this.objectId,
            "from": strDate,
            "to": ndDate,
            "attributes": this.atributesCont
        };
        console.log("Start", this.startDate);
        console.log("data", data);
        this.booking.addBookingObject(data).subscribe((resp: any) => {
            this.dismissLoader();
            console.log("addBookingObject", resp);
            this.submitted = false;
            //this.presentAlertConfirm(data);
            if (resp.status == "success") {
                if (resp.requires_auth) {
                    this.presentAlertConfirm(this.requiresAuth);
                } else {
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
                        "merchant_id": this.objectId,
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
    }
    saveOrCreateBooking(){
        if(this.bookingObj){
            this.editBooking()
        } else {
            this.createBooking();
        }
    }
    editBooking() {
        if (this.submitted) {
            return true;
        }
        this.submitted = true;
        this.showLoader();
        let strDate = this.selectedDate.getFullYear() + "-" + (this.selectedDate.getMonth() + 1) + "-" + this.selectedDate.getDate() + " " + this.startDate.getHours() + ":" + this.startDate.getMinutes() + ":00";
        let ndDate = this.selectedDate.getFullYear() + "-" + (this.selectedDate.getMonth() + 1) + "-" + this.selectedDate.getDate() + " " + (this.startDate.getHours() + + parseInt(this.amount)) + ":" + this.startDate.getMinutes() + ":00";
        this.atributesCont.location = "opentok";
        let data = {
            "booking_id": this.bookingObj.id,
            "type": this.typeObj,
            "object_id": this.objectId,
            "from": strDate,
            "to": ndDate,
            "attributes": this.atributesCont
        };
        console.log("Start", this.startDate);
        console.log("data", data);
        this.booking.editBookingObject(data).subscribe((resp: any) => {
            this.dismissLoader();
            console.log("editBookingObject", resp);
            this.submitted = false;
            //this.presentAlertConfirm(data);
            if (resp.status == "success") {
                
            } else {

            }
        }, (err) => {
            console.log("Error editBookingObject");
            this.dismissLoader();
            this.api.handleError(err);
        });
    }
    deleteBooking() {
        this.showLoader();
        let data = {
            "object_id": this.objectId,
        };
        console.log("Start", this.startDate);
        console.log("data", data);
        this.booking.cancelBookingObject(data).subscribe((resp: any) => {
            this.dismissLoader();
            console.log("addBookingObject", resp);
            this.submitted = false;
            //this.presentAlertConfirm(data);
            if (resp.status == "success") {
                this.navCtrl.back();
            } else {
                if (resp.message == "Not Available") {

                }
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
            this.params.setParams({"merchant_id": this.objectId});
            this.navCtrl.navigateForward('tabs/checkout/shipping/' + this.objectId);
        } else if (data == "Prepare") {
            this.params.setParams({"merchant_id": this.objectId});
            this.navCtrl.navigateForward('tabs/checkout/prepare');
        }
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
        let month = myDate.getMonth();
        let monthcont = {month: month, days: [], title: this.booking.getMonthName(month)};
        for (let i = 0; i < 61; i++) {
            let day = myDate.getDay();
            if (this.checkAvailableDays(this.weekday[day])) {
                let container = new Date(myDate.getTime());
                if (myDate.getMonth() != monthcont.month) {
                    this.months.push(monthcont);
                    let month = myDate.getMonth();
                    monthcont = {month: month, days: [], title: this.booking.getMonthName(month)};
                }
                monthcont.days.push(container);
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
        this.timeSelected = true;
    }
    selectDate(selectedDate: Date) {
        console.log("select date", selectedDate);
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
