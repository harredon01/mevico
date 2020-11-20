import {Component, OnInit, ViewChild} from '@angular/core';
import {NavController, ModalController, AlertController, IonSlides} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ReportsService} from '../../services/reports/reports.service';
import {ParamsService} from '../../services/params/params.service';
import {OrderDataService} from '../../services/order-data/order-data.service';
import {Report} from '../../models/report';
import {DynamicRouterService} from '../../services/dynamic-router/dynamic-router.service';
import {CartPage} from '../cart/cart.page';
import {ApiService} from '../../services/api/api.service';
import {UserDataService} from '../../services/user-data/user-data.service'
import {BookingService} from '../../services/booking/booking.service'
import {CartService} from '../../services/cart/cart.service'
@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.page.html',
  styleUrls: ['./report-detail.page.scss'],
})
export class ReportDetailPage implements OnInit {
    @ViewChild('slides') slides: IonSlides;
    doctor: string = "about";
    Short: string = "n1";
    category: string = "";
    urlSearch: string = "";
    fromSettings: boolean = false;
    report: Report;
    notAvailable: string;
    maxReached: string;
    galPage: any = 1;

    constructor(public navCtrl: NavController,
        public modalCtrl: ModalController,
        public alertsCtrl: AlertController,
        public orderData: OrderDataService,
        public activatedRoute: ActivatedRoute,
        public api: ApiService,
        private drouter: DynamicRouterService,
        public cart: CartService,
        public booking: BookingService,
        public translateService: TranslateService,
        public userData: UserDataService,
        public reportsServ: ReportsService,
        public params: ParamsService) {
        let reportId = this.activatedRoute.snapshot.paramMap.get('objectId');
        let theParams = this.params.getParams();
        let category = this.activatedRoute.snapshot.paramMap.get('categoryId');
        this.urlSearch = 'shop/home/categories/' + category + '/report/' + reportId;

        let vm = this
        this.translateService.get('BOOKING.NOT_AVAILABLE').subscribe(function (value) {
            vm.notAvailable = value;
            console.log("afk", value);
        });
        this.translateService.get('BOOKING.MAX_REACHED').subscribe(function (value) {
            vm.maxReached = value;
            console.log("afk", value);
        });

        this.report = new Report({"availabilities": [], "attributes": [], "files": []});
        this.getReport(reportId);
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

    getReport(report_id:any) {
        let container = {"object_id":report_id,"includes":"files,ratings"};
        this.reportsServ.getReport(container).subscribe((data: any) => {
            let container = data.report;
            container.ratings = data.ratings;
            container.files = data.files;
            this.report = new Report(container);
            console.log("attributes", this.report.attributes);
        }, (err) => {
            console.log("Error getReport");
            this.api.handleError(err);
        });
    }

    ionViewDidEnter() {
        this.api.hideMenu();
        let container = this.params.getParams();
        if(container){
            if (container.hasChanged) {
                this.getReport(this.report.id);
            }
        }
        if (document.URL.startsWith('http')) {
            let vm = this;
            setTimeout(function(){ vm.api.dismissLoader();console.log("Retrying closing") }, 1000);
            setTimeout(function(){ vm.api.dismissLoader();console.log("Retrying closing") }, 2000);
        }
    }
    slidePrev() {
        this.galPage--;
        this.slides.slidePrev();
    }
    slideNext() {
        this.galPage++;
        this.slides.slideNext();
    }

    ngOnInit() {
    }

}
