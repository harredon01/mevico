import {Component, OnInit, ViewChild} from '@angular/core';
import {CategoriesService} from '../../services/categories/categories.service';
import {NavController, ModalController, MenuController, AlertController} from '@ionic/angular';
import {Events} from '../../services/events/events.service';
import {AlertsService} from '../../services/alerts/alerts.service';
import {ProductsService} from '../../services/products/products.service';
import {CartService} from '../../services/cart/cart.service';
import {OrderDataService} from '../../services/order-data/order-data.service';
import {ParamsService} from '../../services/params/params.service';
import {UserDataService} from '../../services/user-data/user-data.service';
import {MapDataService} from '../../services/map-data/map-data.service';
import {AddressesPage} from '../addresses/addresses.page';
import {UserService} from '../../services/user/user.service';
import {MerchantsService} from '../../services/merchants/merchants.service';
import {ReportsService} from '../../services/reports/reports.service';
import {ApiService} from '../../services/api/api.service';
import {ArticlesService} from '../../services/articles/articles.service';
import {DynamicRouterService} from '../../services/dynamic-router/dynamic-router.service';
import {Merchant} from '../../models/merchant';
import {Report} from '../../models/report';
import {Article} from '../../models/article';
import {Product} from '../../models/product';
import {IonSlides} from '@ionic/angular';
import {CartPage} from '../cart/cart.page';
@Component({
    selector: 'app-vet-home',
    templateUrl: './vet-home.page.html',
    styleUrls: ['./vet-home.page.scss'],
})
export class VetHomePage implements OnInit {
    @ViewChild('slideWithNav', {static: false}) slideWithNav: IonSlides;
    location: string = "n1";
    celTitle: string = "";
    notifs: any = 0;
    searchCategory: string = "";
    searchText: any;
    searchError: boolean = false;
    showSearch: boolean = false;
    productCategories: any[] = [];
    possibleAmounts: any[] = [];
    centerCat: any = 0;
    slideOpts = {
        initialSlide: 0,
        speed: 400,
        autoplay: true,
    };
    setcategories: any[] = [
        {"title": "Servicios Veterinarios", "members": [1, 2, 3, 4,5], "categories": []},
        {"title": "Alimentos, Medicamentos y accesorios", "members": [7, 8, 9, 10], "categories": []},
        {"title": "Aseo y belleza", "members": [6], "categories": []},
        {"title": "Servicios Sociales", "members": [11, 12, 13], "categories": []},
        {"title": "Servicios Especiales", "members": [14, 15, 16, 17, 18, 19], "categories": []},
    ];

    merchant_categories: any[] = [];
    category_array_map: any = {};
    report_categories: any[] = [];
    product_categories: any[] = [];
    stores: any[] = [];
    centers: any[] = [];
    latest_reports: any[] = [];
    activeIndex = 0;
    slidesItems: any[] = [];
    newsItems: any[] = [];
    constructor(public navCtrl: NavController,
        public categories: CategoriesService,
        public alertController: AlertController,
        public alerts: AlertsService,
        public productsServ: ProductsService,
        public articles: ArticlesService,
        public params: ParamsService,
        public userData: UserDataService,
        public mapData: MapDataService,
        public userS: UserService,
        public menu: MenuController,
        public merchantsServ: MerchantsService,
        public reportsServ: ReportsService,
        public api: ApiService,
        public drouter: DynamicRouterService,
        public modalCtrl: ModalController,
        public cartProvider: CartService,
        public orderData: OrderDataService,
        public events: Events) {
        let vm = this;
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
        this.centerCat = {id: 13, name: "Centros de prueba", file: "https://picsum.photos/350/300"};
    }

    ngOnInit() {
        this.getHomeCategories();
        //        this.getObjectCategories('report_categories', "App\\Models\\Report");
        //        this.getObjectCategories('merchant_categories', "App\\Models\\Merchant");
        //        this.getObjectCategories('product_categories', "App\\Models\\Product");
        //        this.getObjects(['centers', 'stores'], ['5', '7'], "page=1&category_id=5,7", "Merchant", false);
        //        this.getObjects(['latest_reports'], ['11'], "page=1&category_id=11", "Report", false);
        this.getObjects(['slidesItems', 'newsItems'], ['20', '21'], "page=1&category_id=20,21&order_by=articles.id,asc", "Article", false);
        //        this.loadProducts();
        //        this.loadOptions();
    }
    ionViewDidEnter() {
        console.log("ionViewDidEnter", this.userData._user)
        let container = this.params.getParams();
        let saveParams = false;
        if (container) {
            let mapLocation = container.mapLocation;
            if (mapLocation) {
                saveParams = true;
                this.orderData.setShipping(this.mapData.address);
            }
            if (saveParams) {
                this.params.setParams(container);
            }
        }

        this.api.hideMenu();
        if (document.URL.startsWith('http')) {
            let vm = this;
            setTimeout(function () {vm.api.dismissLoader();; console.log("Retrying closing")}, 1000);
            setTimeout(function () {vm.api.dismissLoader();; console.log("Retrying closing")}, 2000);
        }
        if (this.userData._user) {
            this.loggedInProcedure();
        } else {
            this.checkLogIn();
        }
        if (this.userData.deviceSet) {
            this.getCart();
        }
        this.routeNext();

    }
    showSearchF(){
        if (this.showSearch){
            this.showSearch = false;
        } else {
            this.showSearch = true;
        }
    }
    loggedInProcedure() {
        console.log("loggedInProcedure");
        this.events.publish("authenticated", {});
        console.log("Counting unread");
        this.orderData.loadShipping();
        this.alerts.countUnread().subscribe((resp: any) => {
            console.log("Counting unread resp", resp);
            this.notifs = resp.total;
        }, (err) => {
        });
    }
    getLocationAware() {
        //        this.loadProducts();
        //        this.getObjects(['centers', 'stores'], ['5', '7'], "page=1&category_id=5,7", "Merchant", true);
        //        this.getObjects(['latest_reports'], ['11'], "page=1&category_id=11", "Report", true);
    }
    createAddress() {
        this.mapData.activeType = "Location";
        this.mapData.activeId = "-1";
        this.navCtrl.navigateForward('shop/map');
        console.log("createAddress");
    }
    async openChangeAddress() {
        let params: any = this.params.getParams();
        params.select = "shipping"
        this.params.setParams(params);
        let addModal = await this.modalCtrl.create({
            component: AddressesPage,
            componentProps: params
        });
        await addModal.present();
        const {data} = await addModal.onDidDismiss();
        console.log("Cart closing", data);
        if (data) {
            this.orderData.setShipping(data);
            this.postLocation();
        }
    }
    getObjects(arrayname, categories, query, object_type, locationAware) {
        this.api.loader();
        for (let item in categories) {
            this.category_array_map[categories[item] + ""] = arrayname[item];
        }
        console.log("Getting objects: " + object_type, arrayname, categories);
        console.log("Map: ", this.category_array_map);
        let searchObj = null
        if (locationAware) {
            if (!this.orderData.shippingAddress.lat) {
                this.presentAlertLocation();
            }
            let categoriesS = "";
            for (let i in categories) {
                categoriesS += categories[i] + ",";
            }
            categoriesS = categoriesS.slice(0, categoriesS.length - 1);
            let location = {"lat": this.orderData.shippingAddress.lat, "long": this.orderData.shippingAddress.long, "category": categoriesS};
            if (object_type == "Merchant") {
                searchObj = this.merchantsServ.getNearbyMerchants(location);
            } else if (object_type == "Report") {
                searchObj = this.reportsServ.getNearbyReports(location);
            } else if (object_type == "Article") {
                searchObj = this.articles.getArticles(query);
            }
        } else {
            if (object_type == "Merchant") {
                searchObj = this.merchantsServ.getMerchants(query);
            } else if (object_type == "Report") {
                searchObj = this.reportsServ.getReports(query);
            } else if (object_type == "Article") {
                searchObj = this.articles.getArticles(query);
            }
        }


        searchObj.subscribe((data: any) => {
            let results = data.data;
            for (let one in results) {
                let container = null;
                if (object_type == "Merchant") {
                    container = new Merchant(results[one]);
                } else if (object_type == "Report") {
                    container = new Report(results[one]);
                } else if (object_type == "Article") {
                    container = new Article(results[one]);
                }

                if (results[one].category_id) {
                    this[this.category_array_map[results[one].category_id + ""]].push(container);
                }

            }
            this.api.dismissLoader();
        }, (err) => {
            console.log("Error getMerchantsFromServer");
            this.api.dismissLoader();
            // Unable to log in
            this.api.toast('CATEGORIES.ERROR_GET');
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

    getObjectCategories(arrayName, typeCat) {
        this.api.loader();
        let cont = {type: typeCat}
        this.categories.getCategories(cont).subscribe((data: any) => {
            this.api.dismissLoader();
            console.log("after getCategories typeCat: " + typeCat, data);
            if (data.status == 'success') {
                this[arrayName] = data.data;
            }
        }, (err) => {
            this.api.dismissLoader();
            // Unable to log in
            this.api.toast('CATEGORIES.ERROR_GET');
            this.api.handleError(err);
        });
    }
    getHomeCategories() {
        this.api.loader();
        let cont = {level: 1}
        this.categories.getCategories(cont).subscribe((data: any) => {
            this.api.dismissLoader();
            console.log("after getCategories: ", data);
            if (data.status == 'success') {
                let results = data.data;
                for (let item in results) {
                    let container = results[item];
                    for (let i in this.setcategories) {
                        if (this.setcategories[i].members.includes(container.id)) {
                            this.setcategories[i].categories.push(container);
                        }
                    }
                }
            }
        }, (err) => {
            this.api.dismissLoader();
            // Unable to log in
            this.api.toast('CATEGORIES.ERROR_GET');
            this.api.handleError(err);
        });
    }

    openItem(item: any, category: any, type_object: any, purpose: any, showAddress: any, checkLocationAction: boolean) {

        let destinationUrl = 'shop/home/categories/' + item.id;
        let params = null;
        params = {"item": item, "purpose": purpose, 'showAddress': showAddress}
        if (type_object == "Merchant") {
            if (purpose.length > 0) {
                if (purpose == "book") {
                    params = {
                        "availabilities": null,
                        "type": "Merchant",
                        "objectId": item.id,
                        "objectName": item.name,
                        "objectDescription": item.description,
                        "objectIcon": item.icon,
                    };
                }
                destinationUrl = 'shop/home/categories/' + category + '/merchant/' + item.id + '/' + purpose;
            } else {
                destinationUrl = 'shop/home/categories/' + category + '/merchant/' + item.id;
            }
        }
        if (type_object == "Report") {
            destinationUrl = 'shop/home/categories/' + item.id + '/reports/' + item.id;
        } else if (type_object == "CategoryReport") {
            destinationUrl = 'shop/home/categories/' + item.id + '/reports';
        } else if (type_object == "CategoryMerchant") {
            destinationUrl = 'shop/home/categories/' + item.id + '/merchant';
        } else if (type_object == "CategoryProduct") {
            destinationUrl = 'shop/home/categories/' + item.id + '/products';
        } else if (type_object == "Article") {
            destinationUrl = 'shop/home/articles/' + item.id;
        }
        let locationApproved = true;
        if (checkLocationAction) {
            locationApproved = this.checkLocation();
        }
        if (!locationApproved) {
            this.drouter.addPages(destinationUrl);
            return;
        }

        this.params.setParams(params);
        this.navCtrl.navigateForward(destinationUrl);
    }
    search() {
        console.log("Search: ", this.searchText, " Category: ", this.searchCategory);
        if (this.searchCategory && this.searchCategory.length > 0) {
            let results = this.searchCategory.split("|");
            let typeS = "";
            if (results[0] == "merchants") {
                typeS = "merchant";
            } else if (results[0] == "reports") {
                typeS = "report";
            } else if (results[0] == "products") {
                typeS = "prodsrc";
            }
            typeS += "-search"
            let item = {
                id:results[1],
                type:typeS
            }
            this.openCategory(item);
            //console.log("Url",url);
        } else {
            this.searchError = true;
        }
    }
    openCategory(item: any) {
        console.log("openCategory: ", item);
        let params: any = {"item": item, "purpose": null}
        let destinationUrl = 'shop/home/categories/' + item.id;
        
        if (item.type.includes('report')) {
            destinationUrl = 'shop/home/categories/' + item.id + '/reports';
        } else if (item.type.includes('merchant')) {
            destinationUrl = 'shop/home/categories/' + item.id + '/merchant';
        }
        
        let checkLocationAction = false;
        if (item.type.includes('nearby')) {
            params.showAddress = true;
            params.typeSearch = 'nearby';
            checkLocationAction = true;
        }
        if (item.type.includes('booking')) {
            params.purpose = 'booking';
        }
        if (item.type.includes('products')) {
            params.purpose = 'products';
            checkLocationAction = true;
        }
        if (item.type.includes('coverage')) {
            checkLocationAction = true;
            params.typeSearch = 'coverage';
        }
        if (item.type.includes('search')) {
            params.typeSearch = 'text';
            params.textSearch = this.searchText;
        }
        if (item.type.includes('prodsrc')) {
            destinationUrl = 'shop/home/categories/' + item.id + '/merchant/0/products';
        }
        console.log("Sending params: ", params)
        this.params.setParams(params);
        let locationApproved = true;
        if (checkLocationAction) {
            locationApproved = this.checkLocation();
        }
        if (!locationApproved) {
            this.drouter.addPages(destinationUrl);
            return;
        }
        console.log("destinationUrls: ", destinationUrl)
        this.navCtrl.navigateForward(destinationUrl);
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
        let used = false;
        if (this.drouter.pages) {
            if (this.drouter.pages.length > 0) {
                used = true;
                this.navCtrl.navigateForward(this.drouter.pages);
            }
            this.drouter.pages = null;
        }
        return used;
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

    loadProducts() {
        this.productCategories = [];
        let container = null;
        if (this.orderData.shippingAddress) {
            container = {"includes": "files,merchant", "category_id": 9, "lat": this.orderData.shippingAddress.lat, "long": this.orderData.shippingAddress.long};
        } else {
            container = {"includes": "files,merchant", "category_id": 9};
        }
        this.productsServ.getProductsMerchant(container).subscribe((resp) => {
            if (resp.products_total > 0) {
                this.productCategories = this.productsServ.buildProductInformation(resp);
                console.log("Result build product", this.categories);
                if (this.orderData.cartData) {
                    let items = this.orderData.cartData.items;
                    this.productCategories = this.productsServ.updateVisualWithCart(this.productCategories, items);
                }
                this.productsServ.calculateTotals("load products", this.productCategories);
                //this.createSlides();
            } else {
                this.api.dismissLoader();
            }
        }, (err) => {
            this.api.handleError(err);
            // Unable to log in
        });
    }
    async openCart() {
        let container = {cart: this.orderData.cartData};
        console.log("Opening Cart", container);
        let addModal = await this.modalCtrl.create({
            component: CartPage,
            componentProps: container
        });
        await addModal.present();
        const {data} = await addModal.onDidDismiss();
        this.params.setParams({"merchant_id": 1299});
        if (data == "Shipping" || data == 'Prepare') {
            if (this.userData._user) {
                if (data == "Shipping") {
                    this.navCtrl.navigateForward('shop/home/checkout/shipping');
                } else {
                    this.navCtrl.navigateForward('shop/home/checkout/prepare');
                }
            } else {
                if (data == "Shipping") {
                    this.drouter.addPages('shop/home/checkout/shipping');
                } else {
                    this.drouter.addPages('shop/home/checkout/prepare');
                }
                this.navCtrl.navigateForward('login');
            }
        }
    }

    loadOptions() {
        for (let i = 1; i < 90; i++) {
            let container = {"value": i};
            this.possibleAmounts.push(container);
        }
    }
    selectVariant(item: any) {
        console.log(item);
        this.productsServ.selectVariant(item);
    }
    addCart(item: any) {
        console.log("Add cart item", item);
        if (item.type == 'Booking') {
            this.appointmentbook(item);
        } else {
            this.api.loader();
            this.addCartItem(item);
        }

    }
    appointmentbook(item: any) {
        let questions = [];
        let category_id = null;
        let container = null;
        console.log("variants", item.variants)
        for (let i in item.variants) {
            if (item.variant_id == item.variants[i].id) {
                container = item.variants[i];
                break;
            }
        }
        console.log("Container", container);
        if (container.attributes) {
            if (container.attributes.questions) {
                questions = container.attributes.questions;
            }
            if (container.attributes.category_id) {
                category_id = container.attributes.category_id;
            }
        }
        let params = {
            "availabilities": null,
            "type": "Merchant",
            "objectId": 1308,
            "objectName": "",
            "objectDescription": "",
            "objectIcon": "",
            "expectedPrice": item.price,
            "questions": questions,
            "product_variant_id": item.variant_id,
            "quantity": item.amount,
            "purpose": "external_book"
        }
        console.log(params);
        this.params.setParams(params);
        if (category_id) {
            if (this.userData._user) {
                this.navCtrl.navigateForward("shop/home/categories/" + category_id);
            } else {
                this.drouter.addPages("shop/home/categories/" + category_id);
                this.navCtrl.navigateForward('login');
            }
        } else {
            if (this.userData._user) {
                this.navCtrl.navigateForward("/shop/home/categories/9/merchant/" + item.merchant_id + "/book");
            } else {
                this.drouter.addPages("/shop/home/categories/9/merchant/" + item.merchant_id + "/book");
                this.navCtrl.navigateForward('login');
            }
        }

    }
    checkLocation() {
        if (!this.orderData.shippingAddress) {
            this.presentAlertLocation();
            return false;
        }
        if (!this.orderData.shippingAddress.lat) {
            this.presentAlertLocation();
            return false;
        }
        return true;
    }
    addCartItem(item: any) {
        this.cartProvider.addCart(item).then((resp: any) => {
            console.log("updateCartItem", resp);
            this.api.dismissLoader();
            if (resp.status == "success") {
                this.handleCartSuccess(resp, item);
                if (resp.item) {
                    return resp.item;
                }
            } else {

                this.cartProvider.handleCartError(resp, item);
            }
        });
    }

    reduceCartItem(item: any) {
        item.amount--;
        this.addCartItem(item);

    }
    increaseCartItem(item: any) {
        item.amount++;
        this.addCartItem(item);
    }
    handleCartSuccess(resp: any, item: any) {
        this.orderData.cartData = resp.cart;
        let showPromt = false;
        if (!item.inCart) {
            showPromt = true;
        }
        if (resp.item) {
            item.inCart = true;
            item.item_id = resp.item.id;
            item.amount = resp.item.quantity;
        } else {
            item.inCart = false;
            item.item_id = null;
            item.amount = 1;
        }
        this.productsServ.calculateTotals("update cart item", this.productCategories);
        this.cartProvider.cartUpdateMessage();
        if (showPromt) {
            this.presentAlertPay(resp.item);
        }
    }
    presentAlertPay(item: any) {
        this.alertController.create({
            header: "Quieres ir a pagar",
            inputs: [],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                        this.navCtrl.navigateForward("/shop/home/categories/9/merchant/" + item.merchant_id + "/products");
                    }
                }, {
                    text: 'Ok',
                    handler: (resp) => {
                        console.log('Confirm Ok', item);
                        this.params.setParams({"merchant_id": item.merchant_id});
                        if (this.userData._user) {
                            if (item.attributes.is_shippable == true) {
                                this.navCtrl.navigateForward('shop/home/checkout/shipping');
                            } else {
                                this.navCtrl.navigateForward('shop/home/checkout/prepare');
                            }
                        } else {
                            if (item.attributes.is_shippable == true) {
                                this.drouter.addPages('shop/home/checkout/shipping');
                            } else {
                                this.drouter.addPages('shop/home/checkout/prepare');
                            }
                            this.navCtrl.navigateForward('login');
                        }
                    }
                }
            ]
        }).then(toast => toast.present());
    }
    postLocation() {
        let used = this.routeNext();
        if (!used) {
            this.getLocationAware();
        }
    }

    presentAlertLocation() {
        this.orderData.checkOrInitShipping();
        if (!this.userData._user) {
            this.mapData.hideAll();
            this.mapData.activeType = "Location";
            this.mapData.activeId = "-1";
            this.mapData.merchantId = null;
            this.navCtrl.navigateForward('shop/map');
            let vm = this;
            setTimeout(function () {vm.api.toast("Donde estas?");}, 800);
        } else {
            this.alertController.create({
                header: "Donde estas?",
                inputs: [{
                    name: 'mapa',
                    type: 'radio',
                    label: 'Ubicar en el mapa',
                    value: 'map'
                }, {
                    name: 'shipping',
                    type: 'radio',
                    label: 'Direccion guardada',
                    value: 'shipping'
                }],
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: () => {
                            console.log('Confirm Cancel');
                        }
                    }, {
                        text: 'Ok',
                        handler: (resp) => {
                            console.log('Confirm Ok', resp);
                            if (resp == 'map') {
                                this.mapData.hideAll();
                                this.mapData.activeType = "Location";
                                this.mapData.activeId = "-1";
                                this.mapData.merchantId = null;
                                this.navCtrl.navigateForward('shop/map');
                            } else if (resp == 'shipping') {
                                this.openChangeAddress();
                            }
                        }
                    }
                ]
            }).then(toast => toast.present());
        }
    }
}