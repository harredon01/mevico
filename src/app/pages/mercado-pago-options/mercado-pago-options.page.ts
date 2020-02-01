import {Component, OnInit} from '@angular/core';
import {ParamsService} from '../../services/params/params.service';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../services/api/api.service';
import {OrderDataService} from '../../services/order-data/order-data.service';
import {MercadoPagoService} from '../../services/mercado-pago/mercado-pago.service';
import {NavController, ToastController, LoadingController, ModalController, AlertController} from '@ionic/angular';
import {Payment} from '../../models/payment';
import {UserDataService} from '../../services/user-data/user-data.service';
import {BillingService} from '../../services/billing/billing.service';
@Component({
    selector: 'app-mercado-pago-options',
    templateUrl: './mercado-pago-options.page.html',
    styleUrls: ['./mercado-pago-options.page.scss'],
})
export class MercadoPagoOptionsPage implements OnInit {
    payer: {
        doc_type: string,
        email: string,
        entity_type: string
        payer_id: string,
        financial_institution: string
    } = {
            email: '',
            doc_type: '',
            entity_type: '',
            payer_id: '',
            financial_institution: ""
        };
    payer2: {
        payment_method_id: string,
        email: string,
    } = {
            payment_method_id: '',
            email: ''
        };
    option: any;
    loading: any;
    payerForm: FormGroup;
    payerForm2: FormGroup;
    submitAttempt: boolean = false;
    submitAttempt2: boolean = false;
    v: any;
    v2: any;
    currentItems: any[];
    cards: any[];

    private banksErrorString: string;
    private bankPaymentErrorString: string;
    private emailPaymentTitle: string;
    private emailPaymentDesc: string;
    private confirmString: string;
    private gettingBanks: string;
    private cashErrorString: string;
    private makingPayment: string;

    paymentMethods: any[] = [];
    pse: any = {};
    cash: any = {};
    paymentsSelected: boolean = false;
    paymentPse: boolean = true;
    payment: Payment;
    constructor(private params: ParamsService,
        private navCtrl: NavController,
        public iab: InAppBrowser,
        public orderData: OrderDataService,
        public billing: BillingService,
        public api: ApiService,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        private spinnerDialog: SpinnerDialog,
        public toastCtrl: ToastController,
        public userData: UserDataService,
        public translateService: TranslateService,
        public formBuilder: FormBuilder,
        private mercadoServ: MercadoPagoService) {
        let container = this.params.getParams();
        this.payment = new Payment({"id": 12, "total": 50000});
        this.payerForm = formBuilder.group({
            financial_institution: ['', Validators.required],
            doc_type: ['', Validators.required],
            entity_type: ['', Validators.required],
            email: ['', Validators.compose([Validators.maxLength(100), Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-.]*\.[a-zA-Z]{2,}'), Validators.required])],
            payer_id: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z 0-9._%+-]*'), Validators.required])],
        });
        this.payerForm2 = formBuilder.group({
            payment_method_id: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z 0-9._%+-]*'), Validators.required])],
            email: ['', Validators.compose([Validators.maxLength(100), Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-.]*\.[a-zA-Z]{2,}'), Validators.required])],
        });
        this.currentItems = [];

        this.translateService.get('CHECKOUT_BANKS.BANKS_GET_ERROR').subscribe((value) => {
            this.banksErrorString = value;
        });
        this.translateService.get('CHECKOUT_CASH.PAY_CASH_ERROR').subscribe((value) => {
            this.cashErrorString = value;
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
                email: "",
                payer_id: "",
                doc_type: "",
                entity_type: "",
                financial_institution: this.payer.financial_institution
            };

        } else {
            container = {
                email: this.userData._user.email,
                payer_id: this.userData._user.docNum,
                entity_type: "individual",
                doc_type: this.userData._user.docType,
                financial_institution: this.payer.financial_institution
            };

            this.payer.email = this.userData._user.email;
            this.payer.payer_id = this.userData._user.docNum;
            this.payer.entity_type = "individual";
            this.payer.entity_type = this.userData._user.docType;
        }

        console.log("Setting form values: ", container);
        this.payerForm.setValue(container);
    }
    useUser2() {
        console.log("prefil", this.v);
        console.log("user", this.userData._user);
        let container: any = null;
        if (this.v) {
            container = {
                email: "",
                payment_method_id: this.payer2.payment_method_id
            };
        } else {
            container = {
                payment_method_id: this.payer2.payment_method_id,
                email: this.userData._user.email,
            };
            this.payer2.email = this.userData._user.email;

        }

        console.log("Setting form values: ", container);
        this.payerForm2.setValue(container);
    }

    cancelSelection() {
        this.paymentsSelected = false;
    }
    ngOnInit() {
        this.getPaymentMethods();
    }
    getPaymentMethods() {
        this.mercadoServ.getPaymentMethods().subscribe((resp: any) => {
            console.log("Register connection result", resp);
            this.paymentMethods = resp; 
        }, (err) => {

        });
    }
    submitPaymentPse() {
        this.submitAttempt = true;
        console.log("payBank valid", this.payerForm.valid);
        if (!this.payerForm.valid) {return;}
        this.showLoader();
        let container = {
            doc_type: this.payer.doc_type,
            entity_type: this.payer.entity_type,
            financial_institution: this.payer.financial_institution,
            email: this.payer.email,
            payer_id: this.payer.payer_id,
            payment_id: this.orderData.payment.id,
            platform: "Food"
        };
        this.billing.payDebit(container).subscribe((data: any) => {
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
    dismissLoader() {
        if (document.URL.startsWith('http')) {
            this.loadingCtrl.dismiss();
        } else {
            this.spinnerDialog.hide();
        }
    }
    submitPaymentCash() {
        this.submitAttempt = true;
        if (!this.payerForm.valid) {return;}
        this.showLoader();
        let container = {
            payment_method_id: this.payer2.payment_method_id,
            email: this.payer2.email,
            payment_id: this.orderData.payment.id,
            platform: "Food"
        };
        this.billing.payCash(container).subscribe((data: any) => {
            this.dismissLoader();
            console.log("after payCash");
            console.log(JSON.stringify(data));
            if (data.code == "SUCCESS") {
                if (data.transactionResponse.state == "PENDING") {
                    //this.showPrompt();
                    const browser = this.iab.create(data.transactionResponse.extraParameters.URL_PAYMENT_RECEIPT_HTML);
                    browser.on('exit').subscribe(event => {
                        this.orderData.clearOrder();
                        this.navCtrl.navigateRoot("tabs");
                    });
                }
            }
        }, (err) => {
            this.dismissLoader();
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.cashErrorString,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
            this.api.handleError(err);
        });
    }
    openItem(item: any) {
        this.paymentsSelected = true;


        if (item.payment_type_id == "QUICK") {
            //this.quickPay();
        } else if (item.payment_type_id == "ticket") {
            this.paymentPse = false;
            this.cash = item;
            this.payer2.payment_method_id = item.id;
        } else if (item.payment_type_id == "credit_card") {
            let container = this.params.getParams();
            container.paymentMethodId = item.id;
            this.params.setParams(container);
            this.navCtrl.navigateForward('tabs/mercado-pago-options/mercado-pago');
        } else if (item.payment_type_id == "bank_transfer") {
            this.paymentPse = true;
            console.log("Item", item);
            this.pse = item;
            this.currentItems = item.financial_institutions
        }
    }

}
