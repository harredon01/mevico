import {Component, OnInit} from '@angular/core';
import {NavController, ToastController, ModalController, AlertController, Events, LoadingController} from '@ionic/angular';
import {ParamsService} from '../../services/params/params.service';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductsService} from '../../services/products/products.service';
import {Product} from '../../models/product';
import {ApiService} from '../../services/api/api.service';
@Component({
    selector: 'app-edit-products',
    templateUrl: './edit-products.page.html',
    styleUrls: ['./edit-products.page.scss'],
})
export class EditProductsPage implements OnInit {
    product: Product;
    loading: any;
    submitAttemptP: boolean;
    submitAttemptV: boolean;
    editingVariant: boolean;
    variants: any[] = [];
    formP: FormGroup;
    formV: FormGroup;
    productsErrorStringSave: string = "";
    variantsErrorStringSave: string = "";
    getProductErrorString: string = "";
    constructor(public navCtrl: NavController,
        public activatedRoute: ActivatedRoute,
        public productsServ: ProductsService,
        public toastCtrl: ToastController,
        formBuilder: FormBuilder,
        public api: ApiService,
        public modalCtrl: ModalController,
        public alertCtrl: AlertController,
        private spinnerDialog: SpinnerDialog,
        public loadingCtrl: LoadingController,
        public events: Events,
        public params: ParamsService,
        public translateService: TranslateService) {

        let vm = this;
        this.translateService.get('AVAILABILITY_CREATE.ERROR_SAVE').subscribe((value) => {
            vm.productsErrorStringSave = value;
        });
        this.translateService.get('AVAILABILITY_CREATE.ERROR_SAVE').subscribe((value) => {
            vm.variantsErrorStringSave = value;
        });
        this.translateService.get('AVAILABILITY_CREATE.ERROR_SAVE').subscribe((value) => {
            vm.getProductErrorString = value;
        });
    }

    ionViewDidEnter() {
        this.showLoader();
        let product = this.activatedRoute.snapshot.paramMap.get('productId');
        this.getItem(product);
    }
    editImages() {
        let category = this.activatedRoute.snapshot.paramMap.get('categoryId'); 
        let merchantId = this.activatedRoute.snapshot.paramMap.get('merchantId'); 
        this.navCtrl.navigateForward('tabs/categories/' + category + '/merchant/' + merchantId + "/products/images/" + this.product.id);
    }
    getItem(productId) {
        this.showLoader();
        this.productsServ.getProductSimple(productId).subscribe((data: any) => {
            this.dismissLoader();
            console.log("after get addresses");
            let results = data.product;
            this.product = new Product(results);
            this.variants = results.variants;
            let container = {
                id: this.product.id,
                name: this.product.name,
                description: this.product.description
            };
            console.log("Setting form values: ", container);
            this.formP.setValue(container);
            console.log(JSON.stringify(data));
        }, (err) => {
            this.dismissLoader();
            // Unable to log in
            this.toastCtrl.create({
                message: this.getProductErrorString,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
            this.api.handleError(err);
        });
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

    dismissLoader() {
        if (document.URL.startsWith('http')) {
            this.loadingCtrl.dismiss();
        } else {
            this.spinnerDialog.hide();
        }
    }
    saveProduct() {
        this.submitAttemptP = true;
        console.log("saveavailability");
        if (!this.formP.valid) {return;}
        this.showLoader();
        this.productsServ.saveOrCreateProduct(this.formP.value).subscribe((data: any) => {
            this.dismissLoader();
            console.log("after get addresses");
            let results = data.product;
            this.product = new Product(results);
            this.variants = results.variants;
            let container = {
                id: this.product.id,
                name: this.product.name,
                description: this.product.description
            };
            console.log("Setting form values: ", container);
            this.formP.setValue(container);
            console.log(JSON.stringify(data));
        }, (err) => {
            this.dismissLoader();
            // Unable to log in
            this.toastCtrl.create({
                message: this.productsErrorStringSave,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
            this.api.handleError(err);
        });
    }
    deleteProduct() {
        this.showLoader();
        this.productsServ.deleteProduct(this.product.id).subscribe((data: any) => {
            this.dismissLoader();
            console.log("after get addresses");
            this.navCtrl.back();
            console.log(JSON.stringify(data));
        }, (err) => {
            this.dismissLoader();
            // Unable to log in
            this.toastCtrl.create({
                message: this.productsErrorStringSave,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
            this.api.handleError(err);
        });
    }
    deleteVariant(variantId) {
        this.showLoader();
        this.productsServ.deleteVariant(variantId).subscribe((data: any) => {
            this.dismissLoader();
            console.log("after get addresses");
            this.navCtrl.back();
            for(let item in this.variants){
                if(this.variants[item].id == variantId){
                    this.variants.splice(parseInt(item),1);
                }
            }
            console.log(JSON.stringify(data));
        }, (err) => {
            this.dismissLoader();
            // Unable to log in
            this.toastCtrl.create({
                message: this.variantsErrorStringSave,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
            this.api.handleError(err);
        });
    }
    saveVariant() {
        this.submitAttemptV = true;
        console.log("saveavailability");
        if (!this.formV.valid) {return;}
        this.showLoader();
        this.productsServ.saveOrCreateVariant(this.formV.value).subscribe((data: any) => {
            this.dismissLoader();
            this.editingVariant = false;
            let variant = data.variant;
            for(let item in this.variants){
                if(this.variants[item].id == variant.id){
                    this.variants[item] = variant;
                }
            }
            console.log(JSON.stringify(data));
        }, (err) => {
            this.dismissLoader();
            // Unable to log in
            this.toastCtrl.create({
                message: this.variantsErrorStringSave,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
            this.api.handleError(err);
        });
    }
    editVariant(variant: any) {
        this.editingVariant = true;
        let container = {
            id: variant.id,
            price: variant.price,
            cost: variant.cost,
            sku: variant.sku,
        };
        console.log("Setting form values: ", container);
        this.formV.setValue(container);
    }

    ngOnInit() {
    }

}
