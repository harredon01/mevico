import {Component, OnInit} from '@angular/core';
import {BookingService} from '../../services/booking/booking.service';
import {NavController, LoadingController} from '@ionic/angular';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {Booking} from '../../models/booking';
import {ApiService} from '../../services/api/api.service';
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
        public params: ParamsService,
        public navCtrl: NavController,
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
    approveBooking() {
        this.showLoader();
        let container = {"object_id": this.mainBooking.id};
        this.booking.approveBookingObject(container).subscribe((data: any) => {
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
