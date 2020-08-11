import {Component, OnInit} from '@angular/core';
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
import {ApiService} from '../../services/api/api.service';
import {DynamicRouterService} from '../../services/dynamic-router/dynamic-router.service';
@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    location: string = "n1";
    categoriesErrorGet: string = "";
    celTitle: string = "";
    notifs: any = 0;
    celDesc: string = "";
    celError: string = "";
    items: any[] = [];
    constructor(public navCtrl: NavController,
        public categories: CategoriesService,
        public alertController: AlertController,
        public alerts: AlertsService,
        public params: ParamsService,
        public userData: UserDataService,
        public userS: UserService,
        public menu: MenuController,
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
        }

    ngOnInit() {

        

        if (this.userData._user) {
            

        } 

        
        
    }
    ionViewDidEnter() {
        
        if (document.URL.startsWith('http')) {
            let vm = this;
            setTimeout(function(){ vm.dismissLoader();console.log("Retrying closing") }, 1000);
            setTimeout(function(){ vm.dismissLoader();console.log("Retrying closing") }, 2000);
        }
        
        if (this.userData._user) {
            console.log("Counting unread")
            this.alerts.countUnread().subscribe((resp: any) => {
                console.log("Counting unread resp",resp);
                this.notifs = resp.total;
            }, (err) => {
            });
            this.routeNext();
            this.events.publish("authenticated",{});
            console.log("Counting unread")
            this.alerts.countUnread().subscribe((resp: any) => {
                console.log("Counting unread resp",resp);
                this.notifs = resp.total;
            }, (err) => {
            });
        } else {
            this.checkLogIn();
        }
        this.getItems();
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
    openItem(item: any) {
        this.params.setParams({"item": item});
        if (this.userData._user) {
            this.navCtrl.navigateForward('tabs/home/categories/' + item.id);
        } else {
            this.navCtrl.navigateForward('home/' + item.id);
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
        this.navCtrl.navigateForward(this.drouter.pages);
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

}