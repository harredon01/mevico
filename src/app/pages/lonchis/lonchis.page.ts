
import {Component, ChangeDetectorRef, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavController, NavParams, ModalController, AlertController, ToastController, LoadingController} from '@ionic/angular';
import {FoodService} from '../../services/food/food.service';
import {CartService} from '../../services/cart/cart.service'
import {Events} from '../../services/events/events.service';
import {AlertsService} from '../../services/alerts/alerts.service';
import {ParamsService} from '../../services/params/params.service';
import {SpinnerDialog} from '@ionic-native/spinner-dialog';
import {OrderDataService} from '../../services/order-data/order-data.service';
import {MapDataService} from '../../services/map-data/map-data.service';
import {UserDataService} from '../../services/user-data/user-data.service';
import {DynamicRouterService} from '../../services/dynamic-router/dynamic-router.service';
import {UserService} from '../../services/user/user.service';
import {Merchant} from '../../models/merchant';
import {ConversionPage} from '../conversion/conversion.page';
import {CartPage} from '../cart/cart.page';
import {MerchantsService} from '../../services/merchants/merchants.service';

@Component({
    selector: 'app-lonchis',
    templateUrl: './lonchis.page.html',
    styleUrls: ['./lonchis.page.scss'],
})
export class LonchisPage implements OnInit {

    public itemList: any[];
    public tips: any[] = [];
    currentItems: Merchant[];
    totalDeliveries: any;
    notifs: any;
    loading: any;
    deliveriesGetString: string;
    deliveryWaitingTitle: string;
    deliveryWaitingDesc: string;
    depositPromptTitle: string;
    depositPromptDesc: string;
    celTitle: string;
    celDesc: string;
    celError: string;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public food: FoodService,
        public mapData: MapDataService,
        private drouter: DynamicRouterService,
        public userData: UserDataService,
        public userS: UserService,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        public alerts: AlertsService,
        private cdr: ChangeDetectorRef,
        public cartProvider: CartService,
        public modalCtrl: ModalController,
        public params: ParamsService,
        public orderData: OrderDataService,
        public events: Events,
        public translateService: TranslateService,
        public merchants: MerchantsService,
        public loadingCtrl: LoadingController,
        private spinnerDialog: SpinnerDialog) {
        this.itemList = [];
        this.notifs = 0;
        this.translateService.get('HOME.DELIVERIES_GET').subscribe((value) => {
            this.deliveriesGetString = value;
        });
        this.translateService.get('HOME.DELIVERY_WAITING_TITLE').subscribe((value) => {
            this.deliveryWaitingTitle = value;
        });
        this.translateService.get('HOME.DELIVERY_WAITING_DESC').subscribe((value) => {
            this.deliveryWaitingDesc = value;
        });
        this.translateService.get('HOME.DEPOSIT_PROMPT_TITLE').subscribe((value) => {
            this.depositPromptTitle = value;
        });
        this.translateService.get('HOME.DEPOSIT_PROMPT_DESC').subscribe((value) => {
            this.depositPromptDesc = value;
        });
        this.translateService.get('USER.CEL_TITLE').subscribe((value) => {
            this.celTitle = value;
        });
        this.translateService.get('USER.CEL_DESC').subscribe((value) => {
            this.celDesc = value;
        });
        this.translateService.get('USER.CEL_ERROR').subscribe((value) => {
            this.celError = value;
        });
        events.subscribe('cart:orderFinished', () => {
            this.clearCart();
            // user and time are the same arguments passed in `events.publish(user, time)`
        });
        events.subscribe('home:loadDeliveries', () => {
            this.getArticles();
            if (this.userData._user) {
                this.getCountDeliveries();
            }
            // user and time are the same arguments passed in `events.publish(user, time)`
        });
        events.subscribe('notification:received', (resp: any) => {
            this.notifs++;
            if (resp.type == "order_status") {
                if (resp.payload.order_status == "approved") {
                    //this.getDeliveries(false);
                    this.getCountDeliveries();
                }
            }
            if (resp.type == "food_meal_started") {
                //this.getDeliveries(false);
                this.getCountDeliveries();
            }
            this.cdr.detectChanges();
        });
    }

    ngOnInit() {
    }

    ionViewDidLoad() {
        this.getCart();
        this.getMerchants();
        if (this.userData._user) {
            this.navCtrl.navigateForward(this.drouter.pages);
            this.alerts.countUnread().subscribe((resp: any) => {
                this.notifs = resp.total;
            }, (err) => {
            });
        } else {
            this.checkLogIn();
        }
    }
    ionViewDidEnter() {
        this.getArticles();
        if (this.userData._user) {
            this.events.publish("authenticated", {});
            this.getDeliveries(false);
            this.getCountDeliveries();
        }
        //        console.log("dismiss");
        //        this.dismissLoader();
        //        console.log("dismiss");
        //        this.dismissLoader();
        //        console.log("dismiss");
        //        this.dismissLoader();
    }
    menuOpen() {
        console.log("Menu opened");
        this.events.publish("notifsOpen", {});
        this.notifs = 0;
        this.alerts.readAll();
    }
    checkLogIn() {
        this.userData.getToken().then((value) => {
            console.log("getToken");
            console.log(value);
            if (value) {
                this.navCtrl.navigateForward("login");
            }
        });
    }

    /**
     * Delete an item from the list of cart.
     */
    clearCart() {
        this.cartProvider.clearCart().subscribe((resp) => {
            this.orderData.cartData = {};
            this.orderData.cartData.items = [];
            this.orderData.cartData.total = 0;
            this.orderData.cartData.subtotal = 0;
            this.orderData.cartData.totalItems = 0;
        }, (err) => {
        });
    }
    cleanArticle(containerStart: any) {
        //console.log("Article start: ", containerStart);
        containerStart.start_date = containerStart.start_date.replace("00:00:00", "09:00:00");
        containerStart.start_date = containerStart.start_date.replace(/-/g, '/');
        containerStart.attributes = JSON.parse(containerStart.attributes);
        containerStart.p_principal = 0;
        containerStart.p_harinas = 0;
        containerStart.imagen = '';
        containerStart.p_verduras = 0;
        let entradas = 0;
        let p_verduras = 0;
        let p_harinas = 0;
        let p_principal = 0;
        let platos = 0;
        for (let item in containerStart.attributes.plato) {
            platos++;
            if (containerStart.attributes.plato[item].imagen.length > 0 && containerStart.imagen.length > 0) {
                containerStart.imagen = containerStart.attributes.plato[item].imagen;
            }
            if (containerStart.attributes.plato[item].p_principal > 0) {
                containerStart.p_principal += parseInt(containerStart.attributes.plato[item].p_principal);
            }
            if (containerStart.attributes.plato[item].p_harinas > 0) {
                containerStart.p_harinas += parseInt(containerStart.attributes.plato[item].p_harinas);
            }
            if (containerStart.attributes.plato[item].p_verduras > 0) {
                p_verduras += parseInt(containerStart.attributes.plato[item].p_verduras);
            }
        }
        if (p_principal > 0) {
            containerStart.p_principal = p_principal / platos;
        }
        if (p_harinas > 0) {
            containerStart.p_harinas = p_harinas / platos;
        }
        if (p_verduras > 0) {
            containerStart.p_verduras = p_verduras / platos;
        }
        p_verduras = 0;
        p_harinas = 0;
        p_principal = 0;
        for (let item in containerStart.attributes.entradas) {
            entradas++;
            if (containerStart.attributes.entradas[item].p_principal > 0) {
                p_principal += parseInt(containerStart.attributes.entradas[item].p_principal);
            }
            if (containerStart.attributes.entradas[item].p_harinas > 0) {
                p_harinas += parseInt(containerStart.attributes.entradas[item].p_harinas);
            }
            if (containerStart.attributes.entradas[item].p_verduras > 0) {
                p_verduras += parseInt(containerStart.attributes.entradas[item].p_verduras);
            }
        }
        if (p_principal > 0) {
            containerStart.p_principal += (p_principal / entradas);
        }
        if (p_harinas > 0) {
            containerStart.p_harinas += (p_harinas / entradas);
        }
        if (p_verduras > 0) {
            containerStart.p_verduras += (p_verduras / entradas);
        }
        //containerStart.meal = containerStart.attributes.plato
        containerStart.start_date = new Date(containerStart.start_date);
        containerStart.visible = false;
        containerStart.fecha = this.food.getDayName(containerStart.start_date.getDay()) + " " + containerStart.start_date.getDate() + " " + this.food.getMonthName(containerStart.start_date.getMonth());
        //console.log("Article end: ", containerStart);
        containerStart.meals = [];
        containerStart.deliveries = [];
        return containerStart;
    }
    getWhere(typeW: any) {
        let endDate = new Date();
        let day = endDate.getDay();
        if (day < 5) {
            endDate.setDate(endDate.getDate() + (6 - day));
        } else if (day == 5) {
            endDate.setDate(endDate.getDate() + 7);
        } else if (day == 6) {
            endDate.setDate(endDate.getDate() + 6);
        }
        let where = "";
        let stringEndDate = endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate() + " 23:59:59";
        let startDate = new Date();
        startDate.setDate(startDate.getDate() - 1);
        let stringStartDate = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate() + " 00:00:00";
        if (typeW == "articles") {
            where = `start_date>=${stringStartDate}&start_date<=${stringEndDate}&includes=file&order_by=start_date,asc&page=1`;
        } else {
            where = `delivery>${stringStartDate}&delivery<${stringEndDate}&status!=pending&includes=address&order_by=delivery,asc`;
        }

        return where;
    }
    getArticles() {
        this.itemList = [];
        this.showLoader();
        let where = this.getWhere("articles");
        let currentDate = new Date();
        let timestamp = currentDate.getTime();
        this.food.getArticles(where).subscribe((resp: any) => {
            this.dismissLoader();
            let theArticles = resp.data;
            if (theArticles.length > 0) {
                let containerStart = this.cleanArticle(theArticles[0]);
                if (containerStart.start_date.getTime() < timestamp) {
                    containerStart.isPast = true;
                } else {
                    containerStart.isPast = false;
                }
                currentDate = containerStart.fecha;
                let counter = 0;
                for (let item in theArticles) {
                    let container = theArticles[item];
                    if (counter > 0) {
                        container = this.cleanArticle(container);
                    }
                    if (container.fecha != currentDate) {
                        currentDate = container.fecha;
                        this.itemList.push(containerStart);
                        containerStart = container;
                    }
                    if (containerStart) {
                        containerStart.meals.push(container);
                    }

                    counter++;
                    if (counter == theArticles.length) {
                        this.itemList.push(containerStart);
                    }
                }
                if (this.userData._user) {
                    this.getDeliveries(true);
                }
            }
        }, (err) => {
            this.dismissLoader();
        });
    }
    getPendingArticle(item: any) {
        this.itemList = [];
        this.showLoader();
        this.food.getPendingDelivery().subscribe((resp: any) => {
            this.dismissLoader();
            console.log('response', resp);
            console.log('item', item);
            if (resp.status == "success") {
                let delivery = resp.delivery;
                delivery.delivery = item.start_date.getFullYear() + "-" + (item.start_date.getMonth() + 1) + "-" + item.start_date.getDate() + " 12:00:00";
                if (delivery.status == 'pending') {
                    this.selectDelivery(delivery);
                } else {
                    this.showPromptDeposit(delivery);
                }
            } else {
                this.params.setParams({
                    item: item
                });
                this.navCtrl.navigateForward('tabs/home/programar');
            }
        }, (err) => {
            this.dismissLoader();
        });
    }
    async showPromptDeposit(delivery: any) {
        const prompt = await this.alertCtrl.create({
            header: this.depositPromptTitle,
            message: this.depositPromptDesc,
            inputs: [],
            buttons: [
                {
                    text: 'Programar Deposito',
                    handler: data => {
                        this.selectDelivery(delivery);
                    }
                },
                {
                    text: 'Quiero renovar!',
                    handler: data => {
                        this.openConversion();
                    }
                }
            ]
        });
        await prompt.present().then(() => {
            this.getDeliveries(false);
        });

    }
    goLogin() {
        this.navCtrl.navigateForward('login');
    }

    getMerchants() {
        let where = "id>1290&order_by=id,asc";
        this.merchants.getMerchantsFromServer(where).subscribe((data: any) => {
            data.data = this.merchants.prepareObjects(data.data);
            this.currentItems = data.data;
        }, (err) => {
            console.log("Error getMerchantsFromServer");
        });
    }

    /**
     * Navigate to the detail page for this item.
     */
    openMerchant(item: Merchant) {
        console.log("Opening merchant", item);
        this.params.setParams({
            objectId: item.id
        });
        if (this.userData._user) {
            this.navCtrl.navigateForward('tabs/home/products/'+item.id);
        } else {
            this.navCtrl.navigateForward('home/products/'+item.id);
        }
    }
    showProducts(item: Merchant) {
        let params = {
            "type": "Merchant",
            "objectId": item.id,
            "owner": false
        };
        this.params.setParams(params);
        if (this.userData._user) {
            this.navCtrl.navigateForward('tabs/home/products/'+item.id);
        } else {
            this.navCtrl.navigateForward('home/products/'+item.id);
        }
    }
    openMenuOption(item: any) {
        if (this.userData._user) {
            this.getPendingArticle(item);
        } else {
            console.log("Opening menu option", item);
            this.params.setParams({
                item: item
            });
            this.navCtrl.navigateForward('home/programar');
        }
    }

    /**
     * Navigate to the detail page for this item.
     */
    openCalc() {
        console.log("Opening calc");
        this.navCtrl.navigateForward('tabs/home/calculadora');
    }

    getDeliveries(showLoader: boolean) {
        console.log("Getting deliveries");
        if (showLoader) {
            this.showLoader();
        }

        let where = this.getWhere("deliveries");
        console.log("get deliveries", where)
        this.food.getDeliveries(where).subscribe((resp: any) => {
            if (showLoader) {
                this.dismissLoader();
            }
            let deliveries = resp.data;
            for (let item in this.itemList) {
                this.itemList[item].deliveries = [];
                for (let meal in this.itemList[item].meals) {
                    for (let del in deliveries) {
                        if (this.itemList[item].meals[meal].fecha == deliveries[del].delivery_text) {
                            this.itemList[item].status = deliveries[del].status;
                            this.itemList[item].delivery = deliveries[del];
                            if (!deliveries[del].pushed) {
                                deliveries[del].pushed = true;
                                deliveries[del].details = JSON.parse(deliveries[del].details);
                                this.itemList[item].deliveries.push(deliveries[del]);
                            }

                        }
                    }
                }
            }
            console.log("deliveries", this.itemList);

        }, (err) => {
            if (showLoader) {
                this.dismissLoader();
            }
        });
    }

    programAnother(delivery: any) {
        let theDate = new Date(delivery.delivery);
        let strDate = theDate.getFullYear() + '-' + (theDate.getMonth() + 1) + "-" + theDate.getDate() + " 12:00:00"
        let container = {
            "delivery": strDate
        }
        this.food.updateDeliveryDate(container).subscribe((resp: any) => {
            if (resp.status == "success") {
                resp.delivery.delivery = resp.delivery.delivery.replace(/-/g, '/');
                this.params.setParams({delivery: resp.delivery});
                this.navCtrl.navigateForward("tabs/home/programar");
            } else {
                let toast = this.toastCtrl.create({
                    message: resp.message,
                    duration: 3000,
                    position: 'top'
                }).then(toast => toast.present());
            }
        }, (err) => {

        });
    }
    async openConversion() {
        let addModal = await this.modalCtrl.create({
            component: ConversionPage
        });
        await addModal.present();
        const {data} = await addModal.onDidDismiss();
        if (data == "Checkout") {
            console.log("User: ", this.userData._user);
            if (this.userData._user) {
                this.params.setParams({"merchant_id": 1299});
                this.navCtrl.navigateForward('tabs/checkout/shipping/' + 1299);
            } else {
                this.drouter.addPages([{
                    type: 'Checkout',
                    object_id: 1299
                }]);
                console.log("Pushing login");
                this.navCtrl.navigateForward('login');
            }
        } else {
            this.getArticles();
            this.getCountDeliveries();
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
            this.spinnerDialog.show();
        }
    }
    getCountDeliveries() {
        let url = "status=pending";
        this.food.getDeliveries(url).subscribe((resp: any) => {
            console.log("results", resp);
            this.totalDeliveries = resp.total;
        }, (err) => {

        });
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
            });
        }
    }

    selectDelivery(item) {
        if (item.status == "pending" || item.status == "enqueue" || item.status == "deposit") {
            console.log("Select delivery", item);
            this.params.setParams({delivery: item});
            this.navCtrl.navigateForward("tabs/home/programar" );
        } else if (item.status == "transit") {
            this.mapData.hideAll();
            this.mapData.activeDelivery = item.id;
            this.mapData.activeType = "Delivery";
            this.navCtrl.navigateForward("tabs/map", );
        } else if (item.status == "completed") {
        this.params.setParams({objectJson: item, type_object: "Delivery", object_id: item.id});
            this.navCtrl.navigateForward("tabs/home/comments", );
        } else if (item.status == "enqueue" || item.status == "preparing") {
            this.showPrompt()
        } else if (!item.status) {
            let container = {
                id: -1,
                delivery: item.start_date.getFullYear() + "-" + (item.start_date.getMonth() + "-" + item.start_date.getDate() + " 12:00:00"),
                details: {
                    merchant_id: 1299
                }
            };
            this.params.setParams({delivery: container});
            this.navCtrl.navigateForward("tabs/home/programar" );
        }
    }
    showPrompt() {
        const prompt = this.alertCtrl.create({
            header: this.deliveryWaitingTitle,
            message: this.deliveryWaitingDesc,
            inputs: [],
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                    }
                }
            ]
        }).then(toast => toast.present());
    }
    async openCart() {
        /*let container = {cart: this.orderData.cartData};
        console.log("Opening Cart", container);
        let addModal = await this.modalCtrl.create({
            component: CartPage,
            componentProps: container
        });
        await addModal.present();
        const {data} = await addModal.onDidDismiss();
        console.log("Cart closing", data);
        if (data == "Prepare") {
            this.params.setParams({"merchant_id": 1});
            this.navCtrl.navigateForward('tabs/checkout/prepare');
        }*/
    }
}
