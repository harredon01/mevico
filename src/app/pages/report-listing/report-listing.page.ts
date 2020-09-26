import {Component, OnInit, ViewChild} from '@angular/core';
import {NavController, ModalController} from '@ionic/angular';
import {IonInfiniteScroll} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {MapDataService} from '../../services/map-data/map-data.service';
import {SearchFilteringPage} from '../search-filtering/search-filtering.page';
import {ReportsService} from '../../services/reports/reports.service';
import {ParamsService} from '../../services/params/params.service';
import {UserDataService} from '../../services/user-data/user-data.service';
import {CategoriesService} from '../../services/categories/categories.service';
import {Report} from '../../models/report';
import {ApiService} from '../../services/api/api.service';
import {Router} from '@angular/router';
@Component({
    selector: 'app-report-listing',
    templateUrl: './report-listing.page.html',
    styleUrls: ['./report-listing.page.scss'],
})
export class ReportListingPage implements OnInit {
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
    location: any;
    typeSearch: string = "category";
    urlSearch: string = "";
    totalResults: any;
    textSearch: string = "";
    purpose: string = "";
    showAddress: boolean = false;
    category: any;
    reports: Report[] = [];
    categoryItems: any[] = [];
    page: any = 0;
    loadMore: boolean;

    constructor(public navCtrl: NavController,
        private activatedRoute: ActivatedRoute,
        public params: ParamsService,
        public userData: UserDataService,
        public geolocation: Geolocation,
        public mapData: MapDataService,
        public categories: CategoriesService,
        public reportsServ: ReportsService,
        public router: Router,
        public modalCtrl: ModalController,
        public api: ApiService) {
        this.category = this.activatedRoute.snapshot.paramMap.get('categoryId');
        let container = this.params.getParams();
        if (container) {
            if (container.purpose) {
                if (container.purpose == 'none') {
                    this.purpose = "";
                } else {
                    this.purpose = container.purpose;
                }

            }
            if (container.showAddress) {
                this.showAddress = container.showAddress;
            }
        }
        let activeView = this.router.url;
        console.log("getActive", activeView);
        if (activeView.includes("settings")) {
            this.typeSearch = "own";
            this.urlSearch = 'shop/settings/reports/';
        } else {
            this.urlSearch = 'shop/home/categories/' + this.category + '/reports/';
        }
    }
    ionViewDidEnter() {
        this.api.hideMenu();
        if (document.URL.startsWith('http')) {
            let vm = this;
            setTimeout(function () {vm.api.dismissLoader(); console.log("Retrying closing")}, 1000);
            setTimeout(function () {vm.api.dismissLoader(); console.log("Retrying closing")}, 2000);
        }
    }
    onError(item) {
        console.log("IMG ERROR");
        item.icon = "/assets/avatar/Bentley.png";
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
            this.getReports(null);
        }
    }
    getItems() {
        let query = "reports";
        this.categories.getCategories(query).subscribe((data: any) => {
            console.log("after getCategories");
            this.categoryItems = data.categories;
            this.category = parseInt(this.activatedRoute.snapshot.paramMap.get('categoryId'));
            console.log(JSON.stringify(data));
            //this.cdr.detectChanges();
        }, (err) => {
            // Unable to log in
            this.api.toast('INPUTS.ERROR_GET');
            this.api.handleError(err);
        });
    }
    /**
     * Navigate to the detail page for this item.
     */
    openItem(item: Report) {
        let params = null;
        if (this.typeSearch == "own") {
            params = {"item": item, "category": this.category, "owner": true};
        } else {
            params = {"item": item, "category": this.category};
        }
        this.params.setParams(params);
        console.log("Entering merchant", item);
        if (this.purpose.length > 0) {
            this.navCtrl.navigateForward(this.urlSearch + item.id + "/" + this.purpose);
        } else {
            this.navCtrl.navigateForward(this.urlSearch + item.id);
        }
    }
    /**
     * Navigate to the detail page for this item.
     */
    createItem() {
        if (this.typeSearch == "own") {
            this.navCtrl.navigateForward(this.urlSearch + "create-merchant");
        }
        console.log("Creating merchant");
    }
    /**
     * Navigate to the detail page for this item.
     */
    searchNearby() {
        this.api.loader();
        this.geolocation.getCurrentPosition().then((resp) => {
            console.log("Getting current position after call", resp);
            // resp.coords.latitude
            // resp.coords.longitude
            this.typeSearch = "nearby";
            this.reports = [];
            this.page = 0;
            this.location = {lat: resp.coords.latitude, long: resp.coords.longitude, category: this.category};
            this.api.dismissLoader();
            this.getReports(null);
        }).catch((error) => {
            console.log('Error getting location', error);

        });
    }
    /**
     * Prompt the user to add a new item. This shows our ItemCreatePage in a
     * modal and then adds the new item to our data source if the user created one.
     */
    changeSearchAddress() {
        this.mapData.hideAll();
        this.mapData.activeType = "Location";
        this.mapData.activeId = "-1";
        this.mapData.merchantId = null;
        this.navCtrl.navigateForward('shop/map');
    }
    /**
     * Navigate to the detail page for this item.
     */
    searchText() {
        if (this.textSearch.length > 0) {
            this.reports = [];
            this.page = 0;
            this.typeSearch = "text";
            this.getReports(null);
        }
    }
    searchCategory() {
        this.reports = [];
        this.page = 0;
        this.typeSearch = "category";
        this.getReports(null);
    }
    getReports(event) {
        this.api.loader();
        this.page++;

        let searchObj = null
        if (this.typeSearch == "category") {
            let query = "page=" + this.page + "&category_id=" + this.category;
            searchObj = this.reportsServ.getReports(query);
        } else if (this.typeSearch == "text") {
            searchObj = this.reportsServ.searchReports(this.textSearch + "&page=" + this.page);
        } else if (this.typeSearch == "nearby") {
            this.location.includes = '';
            searchObj = this.reportsServ.getNearbyReports(this.location);
        } else if (this.typeSearch == "own") {
            let query = "page=" + this.page + "&owner_id=" + this.userData._user.id;
            searchObj = this.reportsServ.getReportsPrivate(query);
        }
        searchObj.subscribe((data: any) => {
            if (this.page == 1) {
                this.reports = [];
            }
            if (data.total) {
                this.totalResults = data.total;
            }
            let results = data.data;
            if (data.page == data.last_page) {
                this.infiniteScroll.disabled = true;
            }
            for (let one in results) {
                let container = new Report(results[one]);
                this.reports.push(container);
            }
            if (event) {
                event.target.complete();
            }
            this.api.dismissLoader();
        }, (err) => {
            console.log("Error getReportsFromServer");
            this.api.dismissLoader();
            // Unable to log in
            this.api.toast('INPUTS.ERROR_GET');
            this.api.handleError(err);
        });
    }

    categoryFilterChange() {
        this.page = 0;
        this.getReports(null);
    }

    ngOnInit() {
        this.reports = [];
        this.getReports(null);
        this.getItems();
    }

}