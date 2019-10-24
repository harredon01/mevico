import {Injectable} from '@angular/core';
import {ApiService} from '../api/api.service';
@Injectable({
    providedIn: 'root'
})
export class MercadoPagoService {

    constructor(private api:ApiService) {}
    payCreditCard(data: any) {
        let url = "/mercadopago/pay_cc";
        let seq = this.api.post(url, data);
        return seq;
    }

    payDebit(data: any) {
        let url = "/mercadopago/pay_debit";
        let seq = this.api.post(url, data);
        return seq;
    }

    payCash(data: any) {
        let url = "/mercadopago/pay_cash";
        let seq = this.api.post(url, data);
        return seq;
    }

    getPaymentMethods() {
        let url = "/mercadopago/payment_methods";
        let seq = this.api.get(url);
        return seq;
    }
}
