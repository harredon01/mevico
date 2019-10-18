import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavController, ToastController, ModalController, LoadingController, Events} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {ParamsService} from '../../services/params/params.service';
import {LocationsService} from '../../services/locations/locations.service';
import {UserDataService} from '../../services/user-data/user-data.service';
import {MapDataService} from '../../services/map-data/map-data.service';
import {MerchantsService} from '../../services/merchants/merchants.service';
@Component({
    selector: 'app-create-merchant',
    templateUrl: './create-merchant.page.html',
    styleUrls: ['./create-merchant.page.scss'],
})
export class CreateMerchantPage implements OnInit {
    isReadyToSave: boolean;
    item: any;
    loading: any;
    type: any;
    country: any;
    region: any;
    countries: any[] = [];
    regions: any[] = [];
    cities: any[] = [];
    submitAttempt: boolean;
    form: FormGroup;
    private merchantErrorStringSave: string;
    constructor(public navCtrl: NavController,
        public modalCtrl: ModalController,
        formBuilder: FormBuilder,
        public toastCtrl: ToastController,
        public mapData: MapDataService,
        public merchants: MerchantsService,
        public locations: LocationsService,
        public params: ParamsService,
        public loadingCtrl: LoadingController,
        public translateService: TranslateService,
        public userData: UserDataService,
        private spinnerDialog: SpinnerDialog) {
        this.submitAttempt = false;
        this.country = null;
        this.region = null;
        this.translateService.get('MERCHANT_CREATE.ERROR_SAVE').subscribe((value) => {
            this.merchantErrorStringSave = value;
        });
        this.getCountries();
        this.form = formBuilder.group({
            type: ['', Validators.required],
            name: ['', Validators.required],
            description: ['', Validators.required],
            email: ['', Validators.required],
            telephone: ['', Validators.required],
            address: ['', Validators.required],
            hour: ['', Validators.required],
            booking_requires_auth: [''],
            product_requires_auth: [''],
            lat: [''],
            long: [''],
            service1: [''],
            service2: [''],
            service3: [''],
            specialty1: [''],
            specialty2: [''],
            specialty3: [''],
            city_id: ['', Validators.required],
            region_id: ['', Validators.required],
            country_id: ['', Validators.required],
        });
        let container: any = this.params.getParams();
        let editingMerchant: any = container.merchant;
        let mapLocation: any = container.mapLocation;
        if (editingMerchant) {
            let container = {
                type: editingMerchant.type,
                name: editingMerchant.name,
                description: editingMerchant.description,
                email: editingMerchant.email,
                telephone: editingMerchant.telephone,
                address: editingMerchant.address,
                hour: editingMerchant.hour,
                booking_requires_auth: editingMerchant.type,
                product_requires_auth: editingMerchant.type,
                lat: editingMerchant.lat,
                long: editingMerchant.long,
                service1: '',
                service2: '',
                service3: '',
                specialty1: '',
                specialty2: '',
                specialty3: '',
                city_id: editingMerchant.city_id,
                region_id: editingMerchant.region_id,
                country_id: editingMerchant.country_id,
            };
            let attributes = editingMerchant.attributes;
            let services = attributes.services;
            for (let i = 0; i < services.length; i++) {
                let indicator = i + 1;
                let property = "service" + indicator;
                container[property] = services[i];
            }
            let specialties = attributes.specialties;
            for (let i = 0; i < specialties.length; i++) {
                let indicator = i + 1;
                let property = "specialty" + indicator;
                container[property] = specialties[i];
            }
            console.log("Setting form values: ", container);
            this.isReadyToSave = true;
            this.form.setValue(container);

        } else if (mapLocation) {
            let container = {
                type: mapLocation.type,
                name: '',
                description: '',
                email: '',
                telephone: '',
                address: '',
                hour: '',
                booking_requires_auth: '',
                product_requires_auth: '',
                lat: this.mapData.address.lat,
                long: this.mapData.address.long,
                service1: '',
                service2: '',
                service3: '',
                specialty1: '',
                specialty2: '',
                specialty3: '',
                city_id: '',
                region_id: '',
                country_id: '',
            };
            console.log("Setting form values2: ", container);
            this.form.setValue(container);
        }


        // Watch the form for changes, and
        this.form.valueChanges.subscribe((v) => {
            console.log("form change", v);
            this.isReadyToSave = this.form.valid;
        });
    }
    dismissLoader() {
        if (document.URL.startsWith('http')) {
            this.loadingCtrl.dismiss();
        } else {
            this.spinnerDialog.hide();
        }
    }
    getCountries() {
        this.locations.getCountries().subscribe((resp: any) => {
            this.countries = resp.data;
            console.log("getCountries result", resp);

        }, (err) => {

        });
    }
    selectCountry() {
        this.locations.getRegionsCountry(this.country).subscribe((resp: any) => {
            this.dismissLoader();
            this.region = null;
            console.log("getRegionsCountry result", resp);
            this.regions = resp.data;
        }, (err) => {
            this.dismissLoader();
        });
    }
    selectRegion() {
        this.locations.getCitiesRegion(this.region).subscribe((resp: any) => {
            this.dismissLoader();
            console.log("getCitiesRegion result", resp);
            this.cities = resp.data;
        }, (err) => {
            this.dismissLoader();
        });
    }
    /**
           * Send a POST request to our signup endpoint with the data
           * the user entered on the form.
           */
    saveMerchant(merchant: any) {
        this.submitAttempt = true;
        console.log("saveMerchant", merchant);
        if (!this.form.valid) {return;}
        this.showLoader();
        this.merchants.saveMerchant(merchant).subscribe((resp: any) => {
            this.dismissLoader();
            console.log("Save Address result", resp);
            if (resp.status == "success") {
                this.done();
            } else {
                this.toastCtrl.create({
                    message: this.merchantErrorStringSave,
                    duration: 3000,
                    position: 'top'
                }).then(toast => toast.present());
            }
        }, (err) => {
            this.dismissLoader();
            this.toastCtrl.create({
                message: this.merchantErrorStringSave,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
        });
    }

    /**
     * Prompt the user to add a new item. This shows our ItemCreatePage in a
     * modal and then adds the new item to our data source if the user created one.
     */
    addShippingAddress() {
        this.mapData.hideAll();
        this.mapData.activeType = "Location";
        this.mapData.activeId = "-1";
        this.mapData.merchantId = null;
        this.navCtrl.navigateForward('tabs/map');
    }


    /**
     * The user cancelled, so we dismiss without sending data back.
     */
    cancel() {
        this.navCtrl.back();
    }

    /**
     * The user is done and wants to create the item, so return it
     * back to the presenter.
     */
    done() {
        if (!this.form.valid) {return;}
        this.saveMerchant(this.form.value);
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

    ngOnInit() {
    }

}
