import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavController, ToastController, ModalController, NavParams, LoadingController, Events} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {ParamsService} from '../../services/params/params.service';
@Component({
    selector: 'app-create-merchant',
    templateUrl: './create-merchant.page.html',
    styleUrls: ['./create-merchant.page.scss'],
})
export class CreateMerchantPage implements OnInit {
    isReadyToSave: boolean;
    item: any;
    loading: any;
    submitAttempt: boolean;
    form: FormGroup;
    private addressErrorStringSave: string;
    constructor(public navCtrl: NavController,
        public modalCtrl: ModalController,
        formBuilder: FormBuilder,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        public translateService: TranslateService,
        public navParams: NavParams,
        private spinnerDialog: SpinnerDialog) {
        this.submitAttempt = false;
        this.translateService.get('ADDRESS_FIELDS.ERROR_SAVE').subscribe((value) => {
            this.addressErrorStringSave = value;
        });
        this.form = formBuilder.group({
            address: ['', Validators.required],
            notes: ['', Validators.required],
            postal: ['', Validators.required],
            address_id: [''],
            city_id: ['', Validators.required],
            region_id: ['', Validators.required],
            country_id: ['', Validators.required],
            phone: ['', Validators.required],
            name: ['', Validators.required],
            lat: [''],
            long: [''],
            type: ['', Validators.required],
        });
        let address_id: string = navParams.get('id');
        if (address_id) {
            let container = {
                city_id: 524,
                region_id: 11,
                country_id: 1,
                address_id: address_id,
                address: navParams.get('address'),
                notes: navParams.get('notes'),
                postal: navParams.get('postal'),
                phone: navParams.get('phone'),
                name: navParams.get('name'),
                lat: navParams.get('lat'),
                long: navParams.get('long'),
                type: navParams.get('type'),
            };
            console.log("Setting form values: ", container);
            this.isReadyToSave = true;
            this.form.setValue(container);

        } else {
            let address = "";
            if (navParams.get('address')) {
                address = navParams.get('address');
            }
            let notes = "";
            if (navParams.get('notes')) {
                notes = navParams.get('notes');
            }
            let postal = "";
            if (navParams.get('postal')) {
                postal = navParams.get('postal');
            }
            let lat = "";
            if (navParams.get('lat')) {
                lat = navParams.get('lat');
            }
            let long = "";
            if (navParams.get('long')) {
                long = navParams.get('long');
            }
            let container = {
                city_id: 524,
                region_id: 11,
                country_id: 1,
                address_id: "",
                address: address,
                notes: notes,
                postal: postal,
                lat: lat,
                phone: "",
                name: "",
                long: long,
                type: navParams.get('type'),
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
    /**
           * Send a POST request to our signup endpoint with the data
           * the user entered on the form.
           */
    saveMerchant(address: any) {
        this.submitAttempt = true;
        console.log("saveAddress");
        if (!this.form.valid) {return;}

        return new Promise((resolve, reject) => {
            console.log("Save Address", address);
            if (address) {
                this.showLoader();
                this.addresses.saveAddress(address).subscribe((resp: any) => {
                    this.dismissLoader();
                    console.log("Save Address result", resp);
                    if (resp.status == "success") {
                        resolve(resp.address);
                    } else {
                        resolve(null);
                    }
                }, (err) => {
                    this.dismissLoader();
                    reject(err);
                });
            } else {
                resolve(null);
            }

        });

    }


    /**
     * The user cancelled, so we dismiss without sending data back.
     */
    cancel() {
        this.modalCtrl.dismiss();
    }

    /**
     * The user is done and wants to create the item, so return it
     * back to the presenter.
     */
    done() {
        if (!this.form.valid) {return;}
        this.saveMerchant(this.form.value).then((value) => {
            console.log("saveAddress result", value);
            if (value) {
                this.modalCtrl.dismiss(value);
            } else {
                // Unable to log in
                this.toastCtrl.create({
                    message: this.addressErrorStringSave,
                    duration: 3000,
                    position: 'top'
                }).then(toast => toast.present());
            }
        }).catch((error) => {
            console.log('Error saveAddress', error);
            this.toastCtrl.create({
                message: this.addressErrorStringSave,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
        });;

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
