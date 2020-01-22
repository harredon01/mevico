import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Payment} from '../../models/payment'
import {ParamsService} from '../../services/params/params.service';
import {MercadoPagoService} from '../../services/mercado-pago/mercado-pago.service';
declare var Mercadopago: any;

@Component({
  selector: 'app-mercado-pago-cash',
  templateUrl: './mercado-pago-cash.page.html',
  styleUrls: ['./mercado-pago-cash.page.scss'],
})
export class MercadoPagoCashPage implements OnInit {
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
        let container = this.params.getParams();
        this.paymentMethod = container.paymentMethodId;
        this.payment = new Payment(container.payment);
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

  ngOnInit() {
  }

}
