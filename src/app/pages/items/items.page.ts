import {Component, OnInit} from '@angular/core';
import {ItemsService} from '../../services/items/items.service';
import {TranslateService} from '@ngx-translate/core';
import {NavController, LoadingController} from '@ionic/angular';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {Item} from '../../models/item';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api/api.service';
import {ParamsService} from '../../services/params/params.service';
@Component({
    selector: 'app-items',
    templateUrl: './items.page.html',
    styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {
    private items: Item[] = [];
    private page: any = 0;
    private merchant: any;
    private status: any;
    private queries: [];
    private loadMore: boolean = false;
    constructor(public itemsServ: ItemsService,
        public params: ParamsService,
        public activatedRoute: ActivatedRoute,
        public api: ApiService,
        public translateService: TranslateService,
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public spinnerDialog: SpinnerDialog
    ) {
    this.queries = [];
        this.translateService.get('ITEMS.FULLFILLED').subscribe(function (value) {
            let container ={"name":"FULFILLED","value":"fulfilled"};
            this.queries.push(container);
        });
        this.translateService.get('ITEMS.UNFULFILLED').subscribe(function (value) {
            let container ={"name":"UNFULFILLED","value":"unfulfilled"};
            this.queries.push(container);
        });

        let container = this.params.getParams();
        this.merchant = container.merchant;
        this.status = "unfulfilled"
    }

    ngOnInit() {
        this.getItems();
    }
    selectQuery() {
        this.page = 0;
        this.items = [];
        this.getItems();
    }

    getItems() {
        this.showLoader();
        this.page++;
        let where = "merchant_id=" + this.merchant+"&status="+this.status+"&page="+this.page;
        this.itemsServ.getItems(where).subscribe((data: any) => {
            let results = data.data;
            if (data.page == data.last_page) {
                this.loadMore = false;
            } else {
                this.loadMore = true;
            }
            for (let item in results) {
                results[item].starts_at = new Date(results[item].starts_at);
                results[item].ends_at = new Date(results[item].ends_at);
                let newBooking = new Item(results[item]);
                this.items.push(newBooking);
            }
            this.dismissLoader();
        }, (err) => {
            console.log("Error getBookings");
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

    doInfinite(infiniteScroll) {
        console.log('Begin async operation');
        if (this.loadMore) {
            this.loadMore = false;
            setTimeout(() => {
                this.getItems();
                console.log('Async operation has ended');
                infiniteScroll.complete();
            }, 500);
        } else {
            infiniteScroll.complete();
        }
    }

    openBooking(item: Item) {
        let param = {"item": item};
        this.params.setParams(param);
        let category = this.activatedRoute.snapshot.paramMap.get('categoryId');
        let objectId = this.activatedRoute.snapshot.paramMap.get('objectId');
        this.navCtrl.navigateForward('tabs/categories/' + category + '/merchant/' + objectId + '/items/' + item.id);
    }
}
