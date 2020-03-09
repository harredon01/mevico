import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavController, ToastController, ModalController, LoadingController, Events} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {ParamsService} from '../../services/params/params.service';
import {LocationsService} from '../../services/locations/locations.service';
import {UserDataService} from '../../services/user-data/user-data.service';
import {MapDataService} from '../../services/map-data/map-data.service';
import {MerchantsService} from '../../services/merchants/merchants.service';
import {Merchant} from '../../models/merchant';
@Component({
    selector: 'app-create-merchant',
    templateUrl: './create-merchant.page.html',
    styleUrls: ['./create-merchant.page.scss'],
})
export class CreateMerchantPage implements OnInit {
    isReadyToSave: boolean;
    locationLoaded: boolean = false;
    item: any;
    merchant: Merchant;
    loading: any;
    type: any;
    typeSelected = "";
    country: any;
    region: any;
    city: any;
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
        private cdr: ChangeDetectorRef,
        public merchants: MerchantsService,
        public locations: LocationsService,
        public params: ParamsService,
        public loadingCtrl: LoadingController,
        public translateService: TranslateService,
        public userData: UserDataService,
        private spinnerDialog: SpinnerDialog) {
        this.merchant = new Merchant({files:[],availabilities:[]});
        this.submitAttempt = false;
        this.country = null;
        this.region = null;
        this.translateService.get('MERCHANT_CREATE.ERROR_SAVE').subscribe((value) => {
            this.merchantErrorStringSave = value;
        });
        this.getCountries();
        this.form = formBuilder.group({
            id: [''],
            type: ['', Validators.required],
            name: ['', Validators.required],
            description: ['', Validators.required],
            email: ['', Validators.required],
            telephone: ['', Validators.required],
            address: ['', Validators.required],
            unit_cost: [''],
            booking_requires_auth: [''],
            max_per_hour: [''],
            lat: [''],
            long: [''],
            service1: [''],
            service2: [''],
            service3: [''],
            specialty1: [''],
            specialty2: [''],
            specialty3: [''],
            experience1: [''],
            experience2: [''],
            experience3: [''],
            city_id: ['', Validators.required],
            region_id: ['', Validators.required],
            country_id: ['', Validators.required],
        });
        let container: any = this.params.getParams();
        let merchantLoaded = false;
        if (container) {
            let editingMerchant: any = container.merchant;
            this.merchant = container.merchant;
            if (editingMerchant) {
                this.loadMerchant(editingMerchant)
                merchantLoaded = true;
            }
        }
        if (!merchantLoaded) {
            let lat = "";
            let long = "";
            let address = "";
            let container = {
                id: "",
                type: "",
                name: '',
                description: '',
                email: '',
                telephone: '',
                address: address,
                unit_cost: '',
                booking_requires_auth: '',
                max_per_hour: '',
                lat: lat,
                long: long,
                service1: '',
                service2: '',
                service3: '',
                specialty1: '',
                specialty2: '',
                specialty3: '',
                experience1: '',
                experience2: '',
                experience3: '',
                city_id: '',
                region_id: '',
                country_id: 1,
            };
            console.log("Setting form values2: ", container);
            this.form.setValue(container);
            this.country = 1
            this.selectCountry(null, null);
            this.getMerchant();
        }


        // Watch the form for changes, and
        this.form.valueChanges.subscribe((v) => {
            console.log("form change", v);
            this.isReadyToSave = this.form.valid;
        });
    }
    loadMerchant(editingMerchant: any) {
        let container = {
            id: editingMerchant.id,
            type: editingMerchant.type,
            name: editingMerchant.name,
            description: editingMerchant.description,
            email: editingMerchant.email,
            telephone: editingMerchant.telephone,
            address: editingMerchant.address,
            unit_cost: editingMerchant.unit_cost,
            lat: editingMerchant.lat,
            long: editingMerchant.long,
            city_id: editingMerchant.city_id,
            region_id: editingMerchant.region_id,
            country_id: editingMerchant.country_id,
        };
        this.country = editingMerchant.country_id;
        this.region = editingMerchant.region_id;
        this.city = editingMerchant.city_id;
        this.selectCountry(this.region, this.city);
        this.typeSelected = editingMerchant.type;
        let attributes = editingMerchant.attributes;
        let services = [];
        if (attributes.services) {
            services = attributes.services;

        }
        for (let i = 0; i < 3; i++) {
            let indicator = i + 1;
            let property = "service" + indicator;
            if (services[i]) {
                container[property] = services[i].name;
            } else {
                container[property] = "";
            }
        }
        let specialties = [];
        if (attributes.specialties) {
            specialties = attributes.specialties;
        }
        for (let i = 0; i < 3; i++) {
            let indicator = i + 1;
            let property = "specialty" + indicator;
            if (specialties[i]) {
                container[property] = specialties[i].name;
            } else {
                container[property] = "";
            }
        }
        let experience = [];
        if (attributes.experience) {
            experience = attributes.experience;

        }
        for (let i = 0; i < 3; i++) {
            let indicator = i + 1;
            let property = "experience" + indicator;
            if (experience[i]) {
                container[property] = experience[i].name;
            } else {
                container[property] = "";
            }
        }
        if (attributes.booking_requires_auth) {
            container['booking_requires_auth'] = attributes.booking_requires_auth;
        } else {
            container['booking_requires_auth'] = false;
        }
        if (attributes.max_per_hour) {
            container['max_per_hour'] = attributes.max_per_hour;
        } else {
            container['max_per_hour'] = false;
        }
        console.log("Setting form values: ", container);
        this.isReadyToSave = true;
        this.form.setValue(container);
    }
    ionViewDidEnter() {
        let container: any = this.params.getParams();
        if (container) {
            let mapLocation = container.mapLocation;
            if (mapLocation) {
                let values = this.form.value;
                if (this.mapData.address.lat) {

                    values.lat = this.mapData.address.lat
                }
                if (this.mapData.address.long) {
                    values.long = this.mapData.address.long
                }
                if (this.mapData.address.address) {
                    values.address = this.mapData.address.address
                }
                this.form.setValue(values);
            }
        }
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
            this.country = 1;
            console.log("getCountries result", resp);

        }, (err) => {

        });
    }
    selectCountry(region, city) {
        this.showLoader();
        console.log("selectCountry", region, city);
        this.form.patchValue({country_id: this.country});
        this.locations.getRegionsCountry(this.country).subscribe((resp: any) => {
            this.dismissLoader();
            this.region = null;
            if (region) {
                this.region = region;
                this.form.patchValue({region_id: region});
                this.cdr.detectChanges();
                this.selectRegion(city);
            }

            console.log("getRegionsCountry result", resp);
            this.regions = resp.data;
        }, (err) => {
            this.dismissLoader();
        });
    }
    selectRegion(city) {
        this.showLoader();
        this.locations.getCitiesRegion(this.region).subscribe((resp: any) => {
            this.dismissLoader();
            console.log("getCitiesRegion result", resp);
            this.cities = resp.data;
            if (city) {
                this.city = city;
                this.form.patchValue({city_id: city});
            }
            this.cdr.detectChanges();
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
                let container = {"hasChanged": true};
                this.params.setParams(container);
                this.navCtrl.back();
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
    getMerchant() {
        this.showLoader();
        this.merchants.getMerchant('1305').subscribe((resp: any) => {
            this.dismissLoader();
            console.log("Save Address result", resp);
            if (resp.status == "success") {
                let container = resp.merchant;
                container.files = resp.files;
                container.availabilities = resp.availabilities;
                container.ratings = resp.availabilities;
                this.merchant = new Merchant(container);
                this.loadMerchant(container);
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
        if (this.typeSelected == "location" || this.typeSelected == "medical") {
            this.mapData.hideAll();
            this.mapData.activeType = "Location";
            this.mapData.activeId = "-1";
            this.mapData.merchantId = null;
            this.navCtrl.navigateForward('tabs/map');
        } else {
            let values = this.form.value;
            values.address = "";
            values.lat = 0;
            values.long = 0;
            this.form.setValue(values);
        }

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
