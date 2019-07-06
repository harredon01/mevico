import {Component, OnInit} from '@angular/core';
import {NavController, ModalController, ToastController, LoadingController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {ActivatedRoute} from '@angular/router';
import {SearchFilteringPage} from '../search-filtering/search-filtering.page';
import {MerchantsService} from '../../services/merchants/merchants.service';
import {ParamsService} from '../../services/params/params.service';
import {CategoriesService} from '../../services/categories/categories.service';
import {Merchant} from '../../models/merchant';
@Component({
    selector: 'app-merchant-listing',
    templateUrl: './merchant-listing.page.html',
    styleUrls: ['./merchant-listing.page.scss'],
})
export class MerchantListingPage implements OnInit {
    location: string = "b1";
    category: string = "a1";
    merchants: Merchant[] = [];
    categoryItems: any[] = [];
    categoriesErrorGet:string ="";
    merchantsErrorGet:string ="";
    page: any=0;
    loadMore: boolean;

    constructor(public navCtrl: NavController, 
        private activatedRoute: ActivatedRoute,
        public params: ParamsService,
        public categories: CategoriesService,
        public merchantsServ: MerchantsService,
        public toastCtrl: ToastController,
        public modalCtrl: ModalController,
        public loadingCtrl: LoadingController,
        public translateService: TranslateService,
        private spinnerDialog: SpinnerDialog) {
        this.category = this.activatedRoute.snapshot.paramMap.get('categoryId');
    }
    async filter() {
        let container;
        container = {
            lat: "",
            long: "",
            address: "",
            id: "",
            phone: "",
            name: "",
            postal: "",
            notes: "",
            type: "billing"
        }
        let addModal = await this.modalCtrl.create({
            component: SearchFilteringPage,
            componentProps: container
        });
        await addModal.present();
        const {data} = await addModal.onDidDismiss();
        if (data) {
            this.getMerchants();
        }
    }
    getItems() {
        this.showLoader();
        let query = "merchants";
        this.categories.getCategories(query).subscribe((data: any) => {
            this.dismissLoader();
            console.log("after getCategories");
            this.categoryItems = data.categories;
            this.category = this.activatedRoute.snapshot.paramMap.get('categoryId');
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
    /**
     * Navigate to the detail page for this item.
     */
    openItem(item: Merchant) {
        this.params.setParams({"item":item});
        console.log("Entering merchant",item.id);
        this.navCtrl.navigateForward('tabs/categories/'+this.category+'/merchant/'+item.id); 
    }
    getMerchants() {
        this.showLoader();
        this.page++;
        let query = "page=" + this.page + "&category_id="+this.category;
        this.merchantsServ.getMerchants(query).subscribe((data: any) => {
            let results = data.data;
            if (data.page == data.last_page) {
                this.loadMore = false;
            }
            for (let one in results) {
                results[one].id = results[one].merchant_id;
                let container = new Merchant(results[one]);
                this.merchants.push(container);
            }
            this.dismissLoader();
        }, (err) => {
            console.log("Error getMerchantsFromServer");
            this.dismissLoader();
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.merchantsErrorGet,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
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
    categoryFilterChange(){
        this.page = 0;
        this.getMerchants();
    }

    ngOnInit() {
        
        this.translateService.get('CATEGORIES.ERROR_GET').subscribe((value) => {
            this.categoriesErrorGet = value;
        });
        this.translateService.get('CATEGORIES.ERROR_GET').subscribe((value) => {
            this.merchantsErrorGet = value;
        });
        
        this.getMerchants();
        this.getItems();
    }

}
