import {Component, OnInit} from '@angular/core';
import {ParamsService} from '../../services/params/params.service';
import {BookingService} from '../../services/booking/booking.service';
@Component({
    selector: 'app-booking',
    templateUrl: './booking.page.html',
    styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {
    availableDays: any[];
    availableDates: any[];
    availabilities: any[];
    availabilitiesDate: any[];
    weekday: any[];
    typeObj: string;
    objectId: string;

    constructor(public params: ParamsService, public booking: BookingService) {
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
        this.typeObj = paramsArrived.type;
        this.objectId = paramsArrived.objectId;
        this.getAvailableDates(this.availabilities);
    }

    ngOnInit() {
    }
    makeBooking(merchantId) {
        let data = {
            "type": this.typeObj,
            "objectId": this.objectId,
            "date":"test"
        };
        this.booking.addBookingObject( data).subscribe((data: any) => {

        }, (err) => {
            console.log("Error addBookingObject");
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
            if (this.availableDays[item].range == day) {
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
                this.availableDates.push(myDate);
            }
            myDate.setDate(myDate.getDate() + 1);
        }
    }
    selectDate(selectedDate: Date){
        let day = selectedDate.getDay();
        this.availabilitiesDate = [];
        for (let item in this.availabilities) {
            if (this.availableDays[item].range == this.weekday[day]) {
                this.availabilitiesDate.push(this.weekday[day]);
            }
        }
    }
}
