import {Component, OnInit} from '@angular/core';
import {Availability} from '../../models/availability';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../services/api/api.service';
import {NavController, ToastController, LoadingController, ModalController, AlertController} from '@ionic/angular';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {ParamsService} from '../../services/params/params.service';
import {BookingService} from '../../services/booking/booking.service';
import {ActivatedRoute} from '@angular/router';
import {AvailabilityCreatePage} from '../availability-create/availability-create.page';
@Component({
    selector: 'app-availabilities',
    templateUrl: './availabilities.page.html',
    styleUrls: ['./availabilities.page.scss'],
})
export class AvailabilitiesPage implements OnInit {
    currentItems: Availability[];
    loading: any;
    merchant: any;
    page = 0;
    loadMore = false;
    private availabilityErrorString: string;
    constructor(public navCtrl: NavController,
        public activatedRoute: ActivatedRoute,
        public booking: BookingService,
        public toastCtrl: ToastController,
        public api: ApiService,
        public modalCtrl: ModalController,
        public params: ParamsService,
        public translateService: TranslateService,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        private spinnerDialog: SpinnerDialog) {
        this.currentItems = [];
        this.translateService.get('ADDRESS_FIELDS.ERROR_GET').subscribe((value) => {
            this.availabilityErrorString = value;
        });
        this.merchant = this.activatedRoute.snapshot.paramMap.get('objectId');

    }
    ionViewDidEnter() {
        this.currentItems = [];

        this.getItems();
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
        this.page++
        this.showLoader();
        this.currentItems = [];
        let where = {"type": "Merchant", "object_id": this.merchant};
        this.booking.getAvailabilitiesObject(where).subscribe((data: any) => {
            this.dismissLoader();
            console.log("after getItems", data);
            let results = data.data;
            for (let one in results) {

                let container = new Availability(results[one]);
                container = this.setOrder(container);
                this.currentItems.push(container);
            }
            this.currentItems.sort((a, b) => (a.order > b.order) ? 1 : -1)
            console.log(JSON.stringify(data));
        }, (err) => {
            this.dismissLoader();
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.availabilityErrorString,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
            this.api.handleError(err);
        });
    }
    doInfinite(infiniteScroll) {
        console.log('Begin async operation');
        if (this.loadMore) {
            this.loadMore = false;
            setTimeout(() => {
                this.getItems();
                console.log('Async operation has ended');
                infiniteScroll.event.complete();
            }, 500);
        } else {
            infiniteScroll.event.complete();
        }
    }

    showLoader() {
        if (document.URL.startsWith('http')) {
            this.loading = this.loadingCtrl.create({
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
    /**
     * Delete an item from the list of items.
     */
    deleteAvailability(item) {
        let container = {"id": item.id, "object_id": this.merchant, "type": "Merchant"};
        this.booking.deleteAvailability(container).subscribe((resp: any) => {
            this.dismissLoader();
            if (resp.status == "success") {
                this.currentItems.splice(this.currentItems.indexOf(item), 1);
            }
            //this.navCtrl.push(MainPage);
        }, (err) => {
            this.dismissLoader();
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.availabilityErrorString,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
            this.api.handleError(err);
        });
    }

    async editAvailability(container: any) {
        let addModal = await this.modalCtrl.create({
            component: AvailabilityCreatePage,
            componentProps: container
        });
        await addModal.present();
        const {data} = await addModal.onDidDismiss();
        if (data) {
            console.log("Process complete, address created", data);
            let container = new Availability(data);
            container = this.setOrder(container);
            this.currentItems.push(container);
            this.currentItems.sort((a, b) => (a.order > b.order) ? 1 : -1)

        }
    }
    openItem(item: Availability) {
        this.editAvailability(item);
    }
    createItem() {
        let container = {
            "object_id": this.merchant,
            "type": "Merchant"
        }
        this.editAvailability(container)
    }

    ngOnInit() {
    }

}
