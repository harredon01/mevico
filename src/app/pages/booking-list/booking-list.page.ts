import {Component, OnInit} from '@angular/core';
import {BookingService} from '../../services/booking/booking.service';
import {NavController, LoadingController} from '@ionic/angular';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {Booking} from '../../models/booking';
import {ActivatedRoute} from '@angular/router';
import {ParamsService} from '../../services/params/params.service';
@Component({
    selector: 'app-booking-list',
    templateUrl: './booking-list.page.html',
    styleUrls: ['./booking-list.page.scss'],
})
export class BookingListPage implements OnInit {
    private bookings: Booking[];
    private objectId:any;
    constructor(public booking: BookingService,
        public activatedRoute:ActivatedRoute,
        public params: ParamsService,
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public spinnerDialog: SpinnerDialog
    ) {}

    ngOnInit() {
        this.objectId = this.activatedRoute.snapshot.paramMap.get('object_id');
    }

    getBookings() {
        this.showLoader()
        this.booking.getBookingsObject( this.objectId).subscribe((data: any) => {
            this.bookings = data.data;
            this.dismissLoader();
        }, (err) => {
            console.log("Error getBookings");
            this.dismissLoader();
        });
    }
    openBooking(booking:Booking){
        let param = {"booking":booking};
        this.params.setParams(param);
        let category = this.activatedRoute.snapshot.paramMap.get('category_id')
        this.navCtrl.navigateForward('tabs/categories/'+category+'/merchants/'+this.objectId+'/bookings/'+booking.id );
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
