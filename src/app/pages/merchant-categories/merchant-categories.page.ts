import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CategoriesService} from '../../services/categories/categories.service';
import {NavController, ModalController, ToastController, LoadingController} from '@ionic/angular';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {ParamsService} from '../../services/params/params.service';
import {UserDataService} from '../../services/user-data/user-data.service';
import {HttpClient, HttpParams} from '@angular/common/http';
@Component({
    selector: 'app-merchant-categories',
    templateUrl: './merchant-categories.page.html',
    styleUrls: ['./merchant-categories.page.scss'],
})
export class MerchantCategoriesPage implements OnInit {
    location: string = "n1";
    categoriesErrorGet: string = "";
    items: any[];
    constructor(public navCtrl: NavController,
        public categories: CategoriesService,
        public params: ParamsService,
        public http: HttpClient,
        public userData: UserDataService,
        public toastCtrl: ToastController,
        public modalCtrl: ModalController,
        public loadingCtrl: LoadingController,
        public translateService: TranslateService,
        private spinnerDialog: SpinnerDialog) {}

    ngOnInit() {
        this.translateService.get('CATEGORIES.ERROR_GET').subscribe((value) => {
            this.categoriesErrorGet = value;
        });
        this.getItems();
    }
    buildHeaders(reqOpts) {
        if (reqOpts) {
            console.log("Entrada 1");
            reqOpts.headers = this.userData._headers;
        } else {
            console.log("Entrada 2");
            reqOpts = {
                headers: this.userData._headers
            };
        }
        return reqOpts;
        //return this.http.post(this.url + '/' + endpoint, body, reqOpts);
    }
    /**
       * Navigate to the detail page for this item.
       */
    getItems() {
        this.showLoader();
        let query = "merchants";
        this.categories.getCategories(query).subscribe((data: any) => {
            this.dismissLoader();
            console.log("after getCategories");
            this.items = data.categories;
            console.log(JSON.stringify(data));
        }, (err) => {
            this.dismissLoader();
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.categoriesErrorGet,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
        });
    }
    getItems2() {
        let reqOpts = this.buildHeaders(null);
        this.http.get("https://dev.lonchis.com.co/api/categories/merchant", reqOpts).subscribe((response) => {
    console.log(response);
});
    }
    /**
     * Navigate to the detail page for this item.
     */
    openItem(item: any) {
        this.params.setParams({"item":item});
        this.navCtrl.navigateForward('tabs/categories/'+item.id); 
    }
    searchItems(ev: any) {
        // set val to the value of the searchbar
        const val = ev.target.value;
        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {

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
            this.spinnerDialog.show(null, this.categoriesErrorGet);
        }
    }

}
