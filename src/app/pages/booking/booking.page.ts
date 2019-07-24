import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavController, ToastController, LoadingController, AlertController} from '@ionic/angular';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {ParamsService} from '../../services/params/params.service';
import {ApiService} from '../../services/api/api.service';
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
        let strDate = this.startDate.getFullYear() + "-" + (this.startDate.getMonth() + 1) + "-" + this.startDate.getDate() + " " + this.startDate.getHours() + ":" + this.startDate.getMinutes() + ":00";
        let ndDate = this.startDate.getFullYear() + "-" + (this.startDate.getMonth() + 1) + "-" + this.startDate.getDate() + " " + (this.startDate.getHours()+ + parseInt(this.amount)) + ":" + this.startDate.getMinutes() + ":00";
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
            this.presentAlertConfirm(data);
        }, (err) => {
            console.log("Error addBookingObject");
            this.dismissLoader();
            this.api.handleError(err);
        });
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
        console.log("select date");
        this.showLoader();
        this.startDate = selectedDate;
        this.endDate = selectedDate;
        this.dateSelected = true;
        let strDate = selectedDate.getFullYear() + "-" + (selectedDate.getMonth() + 1) + "-" + selectedDate.getDate() + " 00:00:00";
        let endDate = selectedDate.getFullYear() + "-" + (selectedDate.getMonth() + 1) + "-" + selectedDate.getDate() + " 23:59:59";
        let params = {
            "from": strDate,
            "to": endDate,
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
