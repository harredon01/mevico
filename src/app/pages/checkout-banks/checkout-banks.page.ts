import {Component, OnInit} from '@angular/core';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NavController, ToastController, LoadingController, ModalController, AlertController} from '@ionic/angular';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../services/api/api.service';
import {OrderDataService} from '../../services/order-data/order-data.service';
import {UserDataService} from '../../services/user-data/user-data.service';
import {BillingService} from '../../services/billing/billing.service';

@Component({
    selector: 'app-checkout-banks',
    templateUrl: './checkout-banks.page.html',
    styleUrls: ['./checkout-banks.page.scss'],
})
export class CheckoutBanksPage implements OnInit {
    // The account fields for the login form.
    // If you're using the username field with or without email, make
    // sure to add it to the type
    payer: {
        payer_name: string,
        user_type: string,
        doc_type: string,
        payer_email: string,
        payer_phone: string,
        payer_id: string,
        financial_institution_code: string
    } = {
            payer_name: '',
            payer_email: '',
            payer_phone: '',
            user_type: '',
            doc_type: '',
            payer_id: '',
            financial_institution_code: ""
        };
    option: any;
    loading: any;
    payerForm: FormGroup;
    submitAttempt: boolean = false;
    v: any;
    currentItems: any[];

    private banksErrorString: string;
    private bankPaymentErrorString: string;
    private emailPaymentTitle: string;
    private emailPaymentDesc: string;
    private confirmString: string;
    private gettingBanks: string;
    private makingPayment: string;

    constructor(public navCtrl: NavController,
        public orderData: OrderDataService,
        public iab: InAppBrowser,
        public billing: BillingService,
        public userData: UserDataService,
        public modalCtrl: ModalController,
        public api: ApiService,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        public translateService: TranslateService,
        public formBuilder: FormBuilder,
        public loadingCtrl: LoadingController,
        private spinnerDialog: SpinnerDialog) {
        this.payerForm = formBuilder.group({
            financial_institution_code: ['', Validators.required],
            payer_name: ['', Validators.compose([Validators.maxLength(100), Validators.pattern('[a-zA-Z 0-9._%+-]*'), Validators.required])],
            user_type: ['', Validators.required],
            doc_type: ['', Validators.required],
            payer_phone: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z 0-9._%+-]*'), Validators.required])],
            payer_email: ['', Validators.compose([Validators.maxLength(100), Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-.]*\.[a-zA-Z]{2,}'), Validators.required])],
            payer_id: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z 0-9._%+-]*'), Validators.required])],
        });
        this.currentItems = [];

        this.translateService.get('CHECKOUT_BANKS.BANKS_GET_ERROR').subscribe((value) => {
            this.banksErrorString = value;
        });
        this.translateService.get('CHECKOUT_BANKS.DEBIT_PAY_ERROR').subscribe((value) => {
            this.bankPaymentErrorString = value;
        });
        this.translateService.get('INPUTS.ACKNOWLEDGE').subscribe((value) => {
            this.confirmString = value;
        });
        this.translateService.get('PAYMENT.EMAIL_PAYMENT_CONFIRM_TITLE').subscribe((value) => {
            this.emailPaymentTitle = value;
        });
        this.translateService.get('PAYMENT.EMAIL_PAYMENT_CONFIRM_DESC').subscribe((value) => {
            this.emailPaymentDesc = value;
        });
        this.translateService.get('CHECKOUT_BANKS.GETTING_BANKS').subscribe((value) => {
            this.gettingBanks = value;
        });
        this.translateService.get('CHECKOUT_BANKS.MAKING_PAYMENT').subscribe((value) => {
            this.makingPayment = value;
        });
    }
    useUser() {
        console.log("prefil", this.v);
        console.log("user", this.userData._user);
        console.log("user2", this.userData._user.user);
        let container: any = null;
        if (this.v) {
            container = {
                payer_name: "",
                payer_email: "",
                payer_id: "",
                user_type: "",
                doc_type: "",
                payer_phone: "",
                financial_institution_code: this.payer.financial_institution_code
            };

        } else {
            container = {
                payer_name: this.userData._user.firstName + " " + this.userData._user.lastName,
                payer_email: this.userData._user.email,
                payer_id: this.userData._user.docNum,
                user_type: "N",
                doc_type: this.userData._user.docType,
                payer_phone: this.userData._user.cellphone,
                financial_institution_code: this.payer.financial_institution_code
            };
            this.payer.payer_name = this.userData._user.firstName + " " + this.userData._user.lastName;
            this.payer.payer_email = this.userData._user.email;
            this.payer.payer_id = this.userData._user.docNum;
            this.payer.payer_phone = this.userData._user.cellphone;
            this.payer.user_type = "N";
            this.payer.doc_type = this.userData._user.docType;
        }

        console.log("Setting form values: ", container);
        this.payerForm.setValue(container);
    }

    savePayer(item: any) {
        this.orderData.payerAddress = item;
    }
    showPrompt() {
        const prompt = this.alertCtrl.create({
            header: this.emailPaymentTitle,
            message: this.emailPaymentDesc,
            inputs: [],
            buttons: [
                {
                    text: this.confirmString,
                    handler: data => {
                    }
                }
            ]
        }).then(toast => toast.present());
    }
    dismissLoader() {
        if (document.URL.startsWith('http')) {
            this.loadingCtrl.dismiss();
        } else {
            this.spinnerDialog.hide();
        }
    }

    getBanks() {
        this.showLoader();
        this.billing.getBanks().subscribe((data: any) => {
            this.dismissLoader();
            console.log("after getBanks");
            let results = data.banks;
            for (let one in results) {
                let bank = {"name": results[one].description, "value": results[one].pseCode};
                this.currentItems.push(bank);
            }
            //this.createAddress();
            console.log(JSON.stringify(data));
            //this.mockData();
        }, (err) => {
            this.dismissLoader();
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.banksErrorString,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
            this.api.handleError(err);
        });
    }


    showLoader() {
        if (document.URL.startsWith('http')) {
            this.loading = this.loadingCtrl.create({
                spinner: 'crescent',
                message: this.gettingBanks,
                backdropDismiss: true
            }).then(toast => toast.present());
        } else {
            this.spinnerDialog.show(null, this.gettingBanks);
        }
    }
    showLoaderPay() {
        if (document.URL.startsWith('http')) {
            this.loading = this.loadingCtrl.create({
                spinner: 'crescent',
                message: this.makingPayment,
                backdropDismiss: true
            }).then(toast => toast.present());
        } else {
            this.spinnerDialog.show(null, this.makingPayment);
        }
    }
    /**
       * The view loaded, let's query our items for the list
       */
    ionViewDidEnter() {
        this.getBanks();
    }
    payBank() {
        this.submitAttempt = true;
        console.log("payBank valid",this.payerForm.valid);
        if (!this.payerForm.valid) {return;}
        this.showLoaderPay();
        let container = {
            doc_type: this.payer.doc_type,
            user_type: this.payer.user_type,
            financial_institution_code: this.payer.financial_institution_code,
            payer_name: this.payer.payer_name,
            payer_phone: this.payer.payer_phone,
            payer_email: this.payer.payer_email,
            payer_id: this.payer.payer_id,
            payment_id: this.orderData.payment.id,
            platform: "Food",
            email: true
        };
        this.billing.payDebit(container,"PayU").subscribe((data: any) => {
            this.dismissLoader();
            console.log("after payDebit");
            console.log(JSON.stringify(data));
            if (data.code == "SUCCESS") {
                if (data.transactionResponse.state == "PENDING") {
                    //this.showPrompt();
                    const browser = this.iab.create(data.transactionResponse.extraParameters.BANK_URL);
                    browser.on('exit').subscribe(event => {
                        this.orderData.clearOrder();
                        this.navCtrl.navigateRoot("tabs");
                    });
                } else {
                    let toast = this.toastCtrl.create({
                        message: this.bankPaymentErrorString,
                        duration: 3000,
                        position: 'top'
                    }).then(toast => toast.present());
                }
            } else {
                let toast = this.toastCtrl.create({
                    message: this.bankPaymentErrorString,
                    duration: 3000,
                    position: 'top'
                }).then(toast => toast.present());
            }
        }, (err) => {
            this.dismissLoader();
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.bankPaymentErrorString,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
            this.api.handleError(err);
        });
    }
    mockData() {
        this.payer.doc_type = "CC";
        this.payer.user_type = "N";
        this.payer.financial_institution_code = "1022";
        this.payer.payer_name = "APPROVED";
        this.payer.payer_phone = "3105507245";
        this.payer.payer_email = "harredon01@gmail.com";
        this.payer.payer_id = "1020716535";
    }

    ngOnInit() {
    }

}
