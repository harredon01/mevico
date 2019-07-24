import { Injectable } from '@angular/core';
import {ApiService} from '../api/api.service';
@Injectable({
  providedIn: 'root'
})
export class BillingService {
    constructor(public api: ApiService) {}

    payCreditCard(data: any) {
        let url = "/billing/pay_cc/PayU";
        let seq = this.api.post(url, data);
        return seq;
    }
    payInBank(data: any) {
        let url = "/billing/pay_in_bank/Local";
        let seq = this.api.post(url, data);
        return seq;
    }
    retryPayment(payment: string) {
        let url = "/billing/retry/"+payment;
        let data = {};
        let seq = this.api.post(url,data);
        return seq;
    }
    addTransactionCosts(payment: string) {
        let url = "/billing/add_transaction_costs/"+payment;
        let data = {};
        let seq = this.api.post(url,data);
        return seq;
    }

    payDebit(data: any) {
        let url = "/billing/pay_debit/PayU";
        let seq = this.api.post(url, data);
        return seq;
    }

    payCash(data: any) {
        let url = "/billing/pay_cash/PayU";
        let seq = this.api.post(url, data);
        return seq;
    }
    getRawSources() {
        let url = "/billing/raw_sources/PayU";
        let seq = this.api.get(url);
        return seq;
    }
    getPayments(where) {
        let url = "/billing/payments";

        if (where) {
            url = url + "?" + where;
        }
        let seq = this.api.get(url);
        return seq;
    }
    getBanks() {
        let url = "/payu/banks";
        let seq = this.api.get(url);
        return seq;
    }
    getPaymentMethods() {
        let url = "/payu/payment_methods";
        let seq = this.api.get(url);
        return seq;
    }
}
