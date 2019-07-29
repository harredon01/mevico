import {Component, OnInit} from '@angular/core';
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
    private bookings: Booking[]=[];
    private objectId:any;
    private typeObj:any;
    private page:any = 0;
    private query: string = "";
    private target: string = "";
    private queries:any[] = [];
    constructor(public booking: BookingService,
        public activatedRoute:ActivatedRoute,
        public params: ParamsService,
        public api: ApiService,
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public spinnerDialog: SpinnerDialog
    ) {
        let paramsObj:any = this.params.getParams();
        this.typeObj = paramsObj.type;
        this.target = paramsObj.target;
        this.objectId = this.activatedRoute.snapshot.paramMap.get('object_id');
        this.query = this.target+"_upcoming";
        this.queries = ["unpaid","upcoming","unapproved","past"];
    }

    ngOnInit() {
        this.getBookings();
    }
    
    selectQuery(query) {
        this.page = 0;
        this.bookings = [];
        this.query = this.target+"_"+query;
        this.getBookings();
        
    }

    getBookings() {
        this.showLoader();
        this.page++;
        let container = {
            "query": this.query,
            "type": this.typeObj,
            "object_id":this.objectId,
            "from":new Date(),
            "page":this.page
        };
        this.booking.getBookingsObject( container).subscribe((data: any) => {
            let results = data.data;
            for(let item in results){
                let newBooking = new Booking(results[item]);
                this.bookings.push(newBooking);
            }
            this.bookings = data.data;
            this.dismissLoader();
        }, (err) => {
            console.log("Error getBookings");
            this.dismissLoader();
            this.api.handleError(err);
        });
    }
    openBooking(booking:Booking){
        let param = {"booking":booking};
        this.params.setParams(param);
        
        if(this.target == "bookable"){
            let category = this.activatedRoute.snapshot.paramMap.get('category_id');
            this.navCtrl.navigateForward('tabs/categories/'+category+'/merchants/'+this.objectId+'/bookings/'+booking.id );
        } else {
            this.navCtrl.navigateForward('tabs/bookings/'+booking.id );
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

}
