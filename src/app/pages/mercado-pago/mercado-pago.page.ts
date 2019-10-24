import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Payment} from '../../models/payment'
import {ParamsService} from '../../services/params/params.service';
import {MercadoPagoService} from '../../services/mercado-pago/mercado-pago.service';
declare var Mercadopago: any;
@Component({
    selector: 'app-mercado-pago',
    templateUrl: './mercado-pago.page.html',
    styleUrls: ['./mercado-pago.page.scss'],
})
export class MercadoPagoPage implements OnInit {
    paymentMethod: any;
    year: any;
    month: any;
    payment: Payment;
    cardBranch: any = "";
    logo: any = "";
    installmentsSelected:any;
    doctypes: any[] = [];
    validationErrors: any[] = [];
    installments: any[] = [];
    payerForm: FormGroup;
    submitAttempt: boolean = false;
    dateError: boolean = false;
    cvvError: boolean = false;

    constructor(public formBuilder: FormBuilder, 
        private params: ParamsService,
        private mercadoServ: MercadoPagoService) {
        this.payment = new Payment({"total":10000});
        Mercadopago.getIdentificationTypes((status, response) => {
            if (status !== 200) {
                console.log("Error")
            }
            console.log("Exito", response)
            this.doctypes = response;
        });
        let c = new Date();
        this.payerForm = formBuilder.group({
            cc_number: ['', Validators.compose([Validators.minLength(12), Validators.pattern('[0-9-]*'), Validators.required])],
            cc_security_code: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(4), Validators.pattern('[0-9]*'), Validators.required])],
            cc_name: ['', Validators.compose([Validators.maxLength(100), Validators.pattern('[0-9a-zA-Z ]*'), Validators.required])],
            cc_expiration_month: ['', Validators.compose([Validators.maxLength(2), Validators.pattern('[0-9]*'), Validators.required, Validators.min(1), Validators.max(12)])],
            cc_expiration_year: ['', Validators.compose([Validators.maxLength(4),Validators.minLength(4), Validators.pattern('[0-9]*'), Validators.required, Validators.min(c.getFullYear()), Validators.max(2040)])],
        });
    }

    pay() {
        this.submitAttempt = true;
        this.dateError = false;
        this.cvvError = false;
        if (!this.payerForm.valid) {return;}
        let d = new Date(parseInt(this.year), parseInt(this.month) - 1);
        let c = new Date();
        if (d < c) {
            this.dateError = true;
            return;
        }
        var $form = document.querySelector('#pay');

        Mercadopago.createToken($form, (status, response) => {
            if (status !== 200) {
                console.log("Error")
                this.validationErrors = response.cause;
            } 
            console.log("Exito", response)
        });
    }
    creditTab(event) {
        let target = event.target || event.srcElement;
        let value = target.value;
        let branch = (/^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/.test(value)) ? "MASTERCARD"
            : (/^(4[0-9]{12}(?:[0-9]{3})?$)|(^606374[0-9]{10}$)/.test(value)) ? "VISA"
                : (/^3[47][0-9]{13}$/.test(value)) ? 'AMEX'
                    : (/^[35](?:0[0-5]|[68][0-9])[0-9]{11}$|^30[0-5]{11}$|^3095[0-9]{10}$|^36[0-9]{12}$|^3[89][0-9]{12}$/.test(value)) ? 'DINERS'
                        : (/^6(?:011|5[0-9]{2}|4[4-9][0-9])[0-9]{12}$/.test(value)) ? 'DISCOVER'
                            : (/^589562[0-9]{10}$/.test(value)) ? 'NARANJA'
                                : (/^603488[0-9]{10}$|^2799[0-9]{9}$/.test(value)) ? 'SHOPPING'
                                    : (/^604(([23][0-9]{2})|(400))[0-9]{10}$|^589657[0-9]{10}$/.test(value)) ? 'CABAL'
                                        : (/^603493[0-9]{10}$/.test(value)) ? 'ARGENCARD'
                                            : (/^590712[0-9]{10}$/.test(value)) ? 'CODENSA'
                                                : (/^627180[0-9]{10}$/.test(value)) ? 'CMR'
                                                    : "";

        console.log("Credit branch", branch);
        this.cardBranch = branch;
        if (value.length >= 6) {
            Mercadopago.getPaymentMethod({"bin": value}, (status, response) => {
                if (status !== 200) {
                    console.log("Error",response)
                } else {
                    this.paymentMethod = response[0].payment_type_id;
                    this.logo = response[0].secure_thumbnail;
                    console.log("Exito", response)
                }
            });
            Mercadopago.getInstallments({"bin": value, "amount": this.payment.total}, (status, response) => {
                if (status !== 200) {
                    console.log("Error",response)
                } else {
                    this.installments = response[0].payer_costs;
                    console.log("Exito", response)
                }
            });
        }

    }
    keytab(event, maxlength: any) {
        let nextInput = event.srcElement.nextElementSibling; // get the sibling element
        console.log('nextInput', nextInput);
        var target = event.target || event.srcElement;
        console.log('target', target);
        console.log('targetvalue', target.value);
        console.log('targettype', target.nodeType);
        if (target.value.length < maxlength) {
            return;
        }
        if (nextInput == null)  // check the maxLength from here
            return;
        else
            nextInput.focus();   // focus if not null
    }

    ngOnInit() {
    }
}
