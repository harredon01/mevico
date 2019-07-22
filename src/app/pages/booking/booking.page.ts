import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavController, ToastController, LoadingController} from '@ionic/angular';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {ParamsService} from '../../services/params/params.service';
import {BookingService} from '../../services/booking/booking.service';
@Component({
    selector: 'app-booking',
    templateUrl: './booking.page.html',
    styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {
    availableDays: any[]=[];
    availableDates: Date[]=[];
    selectedSpots: any[]=[];
    availabilities: any[]=[];
    dateSelected: boolean = false;
    availabilitiesDate: any[]=[];
    weekday: any[]=[];
    typeObj: string;
    objectId: string;
    selectedDate: Date;
    startDate: Date;
    endDate: Date;
    amount: any;

    constructor(public params: ParamsService, public booking: BookingService,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
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
        console.log("Availabilities",this.availabilities);
        this.typeObj = paramsArrived.type;
        this.objectId = paramsArrived.objectId;
        this.getAvailableDates(this.availabilities);
        console.log("Get availableDays",this.availableDays);
        
        this.getDates();
        console.log("Get availableDates",this.availableDates);
    }

    ngOnInit() {
    }
    makeBooking(merchantId) {
        this.showLoader();
        let strDate = this.startDate.getFullYear()+"-"+(this.startDate.getMonth()+1)+"-"+this.startDate.getDate()+" 00:00:00";
        let endDate = this.endDate.getFullYear()+"-"+(this.endDate.getMonth()+1)+"-"+this.endDate.getDate()+" 23:59:59";
        let data = {
            "type": this.typeObj,
            "objectId": this.objectId,
            "from":this.startDate,
            "to":this.endDate
        };
        this.booking.addBookingObject( data).subscribe((data: any) => {
            this.dismissLoader();
        }, (err) => {
            console.log("Error addBookingObject");
            this.dismissLoader();
        });
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
        this.endDate = this.startDate;
        this.endDate.setHours( this.startDate.getHours() + this.amount );
    }
    selectDate(selectedDate: Date){
        this.showLoader();
        this.startDate = selectedDate;
        this.endDate = selectedDate;
        this.dateSelected = true;
        let strDate = selectedDate.getFullYear()+"-"+(selectedDate.getMonth()+1)+"-"+selectedDate.getDate()+" 00:00:00";
        let endDate = selectedDate.getFullYear()+"-"+(selectedDate.getMonth()+1)+"-"+selectedDate.getDate()+" 23:59:59";
        let params = {
            "from":strDate,
            "to":endDate,
            "type": this.typeObj,
            "object_id": this.objectId,
        };
        this.booking.getBookingsObject( params).subscribe((data: any) => {
            this.selectedSpots = data.data;
            this.dismissLoader();
        }, (err) => {
            console.log("Error addBookingObject");
        });
        let day = selectedDate.getDay();
        this.availabilitiesDate = [];
        for (let item in this.availabilities) {
            if (this.availabilities[item].range == this.weekday[day]) {
                this.availabilitiesDate.push((this.availabilities[item]));
            }
        }
        console.log("Availabilities",this.availabilitiesDate);
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
