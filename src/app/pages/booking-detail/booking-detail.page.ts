import { Component, OnInit } from '@angular/core';
import {BookingService} from '../../services/booking/booking.service';
import {NavController, LoadingController} from '@ionic/angular';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {Booking} from '../../models/booking';
import { ActivatedRoute } from '@angular/router';
import {ParamsService} from '../../services/params/params.service';
@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.page.html',
  styleUrls: ['./booking-detail.page.scss'],
})
export class BookingDetailPage implements OnInit {
private mainBooking: Booking;
  constructor(public booking: BookingService,
        public activatedRoute:ActivatedRoute,
        public params: ParamsService,
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public spinnerDialog: SpinnerDialog
    ) {}

  ngOnInit() {
      let params = this.params.getParams();
      this.mainBooking = params.booking;
  }
  cancelBooking(){
      this.showLoader();
      this.booking.cancelBookingObject(this.mainBooking.id).subscribe((data: any) => {
            this.mainBooking.status = "canceled";
            this.dismissLoader();
        }, (err) => {
            console.log("Error cancelBooking");
            this.dismissLoader();
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
