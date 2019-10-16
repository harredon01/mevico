import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {BookingService} from '../../services/booking/booking.service';
import {NavController, LoadingController} from '@ionic/angular';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {Booking} from '../../models/booking';
import {ApiService} from '../../services/api/api.service';
import {ActivatedRoute} from '@angular/router';
import {ParamsService} from '../../services/params/params.service';
@Component({
    selector: 'app-booking-list',
    templateUrl: './booking-list.page.html',
    styleUrls: ['./booking-list.page.scss'],
})
export class BookingListPage implements OnInit {
    private bookings: Booking[] = [];
    private loadMore: boolean = false;
    private bookingObjects: any[] = [];
    private objectId: any;
    private selectedObject: any;
    private typeObj: any;
    private page: any = 0;
    private query: string = "";
    private queryMod: string = "";
    private target: string = "";
    private queries: any[] = [];
    constructor(public booking: BookingService,
        public activatedRoute: ActivatedRoute,
        public params: ParamsService,
        public api: ApiService,
        public translateService: TranslateService,
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public spinnerDialog: SpinnerDialog
    ) {
        let paramsObj: any = this.params.getParams();
        this.typeObj = paramsObj.type;
        this.target = paramsObj.target;
        this.objectId = paramsObj.objectId;
        this.selectedObject = {"id": paramsObj.objectId, "name": paramsObj.name};
        this.bookingObjects.push(this.selectedObject);
        this.query = this.target + "_upcoming";
        this.queries = [];
        this.translateService.get('BOOKING.UNPAID').subscribe(function (value) {
            let container ={"name":value,"value":"unpaid"};
            this.queries.push(container);
        });
        this.translateService.get('BOOKING.UPCOMING').subscribe(function (value) {
            let container ={"name":value,"value":"upcoming"};
            this.queries.push(container);
        });
        this.translateService.get('BOOKING.UNAPPROVED').subscribe(function (value) {
            let container ={"name":value,"value":"unapproved"};
            this.queries.push(container);
        });
        this.translateService.get('BOOKING.PAST').subscribe(function (value) {
            let container ={"name":value,"value":"past"};
            this.queries.push(container);
        });
        this.queryMod = "upcoming";
    }

    ngOnInit() {
        this.getBookings();
        this.getObjectsWithBookingUser();
    }

    selectQuery() {
        this.page = 0;
        this.bookings = [];
        this.query = this.target + "_" + this.queryMod;
        this.getBookings();
    }

    selectObject() {
        this.page = 0;
        this.bookings = [];
        if (this.objectId == -1) {
            this.target = "customer";
        } else {
            this.target = "bookable";
        }
        this.query = this.target + "_" + this.queryMod;
        this.getBookings();
    }

    getBookings() {
        this.showLoader();
        this.page++;
        let selectedDate = new Date();
        let strDate = selectedDate.getFullYear() + "-" + (selectedDate.getMonth() + 1) + "-" + selectedDate.getDate();
        let container = {
            "query": this.query, 
            "type": this.typeObj,
            "object_id": this.objectId,
            "from": strDate,
            "page": this.page
        };
        this.booking.getBookingsObject(container).subscribe((data: any) => {
            let results = data.data;
            if (data.page == data.last_page) {
                this.loadMore = false;
            } else {
                this.loadMore = true;
            }
            for (let item in results) {
                results[item].starts_at = results[item].starts_at.replace(" ", "T");
                results[item].ends_at = results[item].ends_at.replace(" ", "T");
                results[item].starts_at = new Date(results[item].starts_at);
                results[item].ends_at = new Date(results[item].ends_at);
                let newBooking = new Booking(results[item]);
                this.bookings.push(newBooking);
            }
            this.dismissLoader();
        }, (err) => {
            console.log("Error getBookings");
            this.dismissLoader();
            this.api.handleError(err);
        });
    }
    getObjectsWithBookingUser() {
        this.booking.getObjectsWithBookingUser().subscribe((data: any) => {
            this.bookingObjects = data.data;
            let user = {"id": -1, "name": "Personal"};
            this.bookingObjects.unshift(user);
            for (let item in this.bookingObjects) {
                if (this.bookingObjects[item].id == this.objectId) {
                    this.selectedObject = this.bookingObjects[item];
                    this.objectId = this.bookingObjects[item].id;
                    break;
                }
            }
        }, (err) => {
            console.log("Error getBookings");
            this.api.handleError(err);
        });
    }
    openBooking(booking: Booking) {
        let param = {"booking": booking};
        this.params.setParams(param);
        if (this.target == "bookable") {
            let category = this.activatedRoute.snapshot.paramMap.get('categoryId');
            this.navCtrl.navigateForward('tabs/categories/' + category + '/merchant/' + this.objectId + '/bookings/' + booking.id);
        } else {
            this.navCtrl.navigateForward('tabs/settings/bookings/' + booking.id);
        }
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
    doInfinite(infiniteScroll) {
        console.log('Begin async operation');
        if (this.loadMore) {
            this.loadMore = false;
            setTimeout(() => {
                this.getBookings();
                console.log('Async operation has ended');
                infiniteScroll.target.complete();
            }, 500);
        } else {
            infiniteScroll.target.complete();
        }
    }

}
