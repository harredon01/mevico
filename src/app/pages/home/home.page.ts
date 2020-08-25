import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CategoriesService} from '../../services/categories/categories.service';
import {NavController, ModalController, ToastController, LoadingController, MenuController, AlertController} from '@ionic/angular';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {Events} from '../../services/events/events.service';
import {AlertsService} from '../../services/alerts/alerts.service';
import {CartService} from '../../services/cart/cart.service';
import {OrderDataService} from '../../services/order-data/order-data.service';
import {ParamsService} from '../../services/params/params.service';
import {UserDataService} from '../../services/user-data/user-data.service';
import {UserService} from '../../services/user/user.service';
import {MerchantsService} from '../../services/merchants/merchants.service';
import {ApiService} from '../../services/api/api.service';
import {ArticlesService} from '../../services/articles/articles.service';
import {DynamicRouterService} from '../../services/dynamic-router/dynamic-router.service';
import {Merchant} from '../../models/merchant';
import {Article} from '../../models/article';
import {IonSlides} from '@ionic/angular';
@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    @ViewChild('slideWithNav', {static: false}) slideWithNav: IonSlides;
    location: string = "n1";
    categoriesErrorGet: string = "";
    celTitle: string = "";
    notifs: any = 0;
    centerCat: any = 0;
    celDesc: string = "";
    merchantsErrorGet: string = "";
    celError: string = "";
    slideOpts = {
        initialSlide: 0,
        speed: 400,
        autoplay: true,
    };
    items: any[] = [];
    stores: any[] = [];
    centers: any[] = [];
    activeIndex = 0;
    slidesItems: any[] = [];
    newsItems: any[] = [];
    constructor(public navCtrl: NavController,
        public categories: CategoriesService,
        public alertController: AlertController,
        public alerts: AlertsService,
        public articles: ArticlesService,
        public params: ParamsService,
        public userData: UserDataService,
        public userS: UserService,
        public menu: MenuController,
        public merchantsServ: MerchantsService,
        public api: ApiService,
        public drouter: DynamicRouterService,
        public toastCtrl: ToastController,
        public modalCtrl: ModalController,
        public loadingCtrl: LoadingController,
        public translateService: TranslateService,
        public cartProvider: CartService,
        public orderData: OrderDataService,
        private spinnerDialog: SpinnerDialog,
        public events: Events) {
        let vm = this;
        this.translateService.get('CATEGORIES.ERROR_GET').subscribe((value) => {
            vm.categoriesErrorGet = value;
        });
        this.translateService.get('USER.CEL_TITLE').subscribe((value) => {
            vm.celTitle = value;
        });
        this.translateService.get('USER.CEL_DESC').subscribe((value) => {
            vm.celDesc = value;
        });
        this.translateService.get('USER.CEL_ERROR').subscribe((value) => {
            vm.celError = value;
        });
        this.translateService.get('CATEGORIES.ERROR_GET').subscribe((value) => {
            vm.merchantsErrorGet = value;
        });
        events.subscribe('cart:orderFinished', () => {
            this.clearCart();
            // user and time are the same arguments passed in `events.publish(user, time)`
        });
        events.subscribe('notification:received', (resp: any) => {
            this.notifs++;
            if (resp.type == "order_status") {
                if (resp.payload.order_status == "approved") {
                    //this.getDeliveries(false);
                }
            }
            if (resp.type == "food_meal_started") {
                //this.getDeliveries(false);
            }
        });
        this.events.subscribe('storageInitialized', (data: any) => {
            this.checkLogIn();
            // user and time are the same arguments passed in `events.publish(user, time)`
        });
        this.events.subscribe('deviceSet', (data: any) => {
            this.getCart();
            // user and time are the same arguments passed in `events.publish(user, time)`
        });
        this.centerCat = {id:13,name:"Centros de prueba",file:"https://picsum.photos/350/300"};
    }

    ngOnInit() {
        this.getItems();
        this.getMerchants('stores',24);
        this.getArticles();
    }
    ionViewDidEnter() {

        if (document.URL.startsWith('http')) {
            let vm = this;
            setTimeout(function () {vm.dismissLoader(); console.log("Retrying closing")}, 1000);
            setTimeout(function () {vm.dismissLoader(); console.log("Retrying closing")}, 2000);
        }

        if (this.userData._user) {
            console.log("Counting unread")
            this.alerts.countUnread().subscribe((resp: any) => {
                console.log("Counting unread resp", resp);
                this.notifs = resp.total;
            }, (err) => {
            });
            this.routeNext();
            this.events.publish("authenticated", {});
            console.log("Counting unread")
            this.alerts.countUnread().subscribe((resp: any) => {
                console.log("Counting unread resp", resp);
                this.notifs = resp.total;
            }, (err) => {
            });
        } else {
            this.checkLogIn();
        }
        if (this.userData.deviceSet) {
            this.getCart();
        }
        
    }
    getMerchants(arrayname,category) {
        this.showLoader();
        let searchObj = null
        let query = "page=1&category_id="+category;
        searchObj = this.merchantsServ.getMerchants(query);
        searchObj.subscribe((data: any) => {
            data.data = this.merchantsServ.prepareObjects(data.data);
            let results = data.data;
            for (let one in results) {
                if (results[one].merchant_id) {
                    results[one].id = results[one].merchant_id;
                }
                if (results[one].categorizable_id) {
                    results[one].id = results[one].categorizable_id;
                }
                let container = new Merchant(results[one]);
                this[arrayname].push(container);
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
            this.api.handleError(err);
        });
    }
    getArticles() {
        this.showLoader();
        let searchObj = null;
        this.slidesItems = [];
        this.newsItems = [];
        let query = "category_id=22,23&includes=files&order_by=category_id,asc";
        searchObj = this.articles.getArticles(query);
        searchObj.subscribe((data: any) => {
            let results = data.data;
            for (let one in results) {
                let container = new Article(results[one]);
                if (container.category_id == 22) {
                    this.slidesItems.push(results[one]);
                } else if (container.category_id == 23) {
                    this.newsItems.push(results[one]);
                }
            }
            this.dismissLoader();
        }, (err) => {
            console.log("Error getArticles");
            this.dismissLoader();
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.merchantsErrorGet,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
            this.api.handleError(err);
        });
    }
    checkLogIn() {
        this.userData.getToken().then((value) => {
            console.log("getToken");
            console.log(value);
            if (value) {
                this.navCtrl.navigateForward('login');
            }
        });
    }

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
            this.api.handleError(err);
        });
    }
    /**
     * Navigate to the detail page for this item.
     */
    openItem(item: any,purpose:any,showAddress:any) {
        this.params.setParams({"item": item,"purpose":purpose,'showAddress':showAddress});
        if (this.userData._user) {
            this.navCtrl.navigateForward('tabs/home/categories/' + item.id);
        } else {
            this.navCtrl.navigateForward('home/' + item.id);
        }

    }
    openStore(item: any, category: any) {
        this.params.setParams({
            objectId: item.id
        });
        if (this.userData._user) {
            this.navCtrl.navigateForward('tabs/home/categories/' + category + "/merchant/" + item.id + "/products");
        } else {
            this.navCtrl.navigateForward('home/' + category + "/merchant/" + item.id + "/products");
        }
    }
    openMenu() {
        this.menu.enable(true, 'end');
        this.menu.open('end');
        this.notifs = 0;
        this.alerts.readAll();
    }
    searchItems(ev: any) {
        // set val to the value of the searchbar
        const val = ev.target.value;
        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {

        }
    }
    async dismissLoader() {
        if (document.URL.startsWith('http')) {
            let topLoader = await this.loadingCtrl.getTop();
            while (topLoader) {
                if (!(await topLoader.dismiss())) {
                    console.log('Could not dismiss the topmost loader. Aborting...');
                    return;
                }
                topLoader = await this.loadingCtrl.getTop();
            }
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
    getCart() {
        if (this.userData._user) {
            this.cartProvider.getCheckoutCart().subscribe((resp) => {
                if (resp) {
                    console.log("getCart", resp);
                    this.orderData.cartData = resp;
                }
            }, (err) => {
                console.log("getCartError", err);
                this.orderData.cartData = null;
                this.api.handleError(err);
            });
        } else {
            this.cartProvider.getCart().subscribe((resp) => {
                if (resp) {
                    console.log("getCart", resp);
                    this.orderData.cartData = resp;
                }
            }, (err) => {
                console.log("getCartError", err);
                this.orderData.cartData = null;
                this.api.handleError(err);
            });
        }
    }
    login() {
        this.navCtrl.navigateForward('login');
    }
    routeNext() {
        if (this.drouter.pages) {
            this.navCtrl.navigateForward(this.drouter.pages);
            this.drouter.pages = null;
        }
    }
    clearCart() {
        this.cartProvider.clearCart().subscribe((resp) => {
            if (resp) {
                console.log("clearCart", resp);
                this.orderData.cartData = null;
            }
        }, (err) => {
            console.log("clearCart", err);
            this.orderData.cartData = null;
            this.api.handleError(err);
        });
    }

    //Move to Next slide
    slideNext() {
        this.slideWithNav.slideNext();
        this.slideWithNav.getActiveIndex().then((value) => {
            this.activeIndex = value;
        });
    }

    //Move to previous slide
    slidePrev() {
        this.slideWithNav.slidePrev();
        this.slideWithNav.getActiveIndex().then((value) => {
            this.activeIndex = value;
        });
    }
    SlideDidChange() {
    this.slideWithNav.getActiveIndex().then((value) => {
            this.activeIndex = value;
        });
  }

}