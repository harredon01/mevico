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

        seq.subscribe((data: any) => {
            console.log("after payCreditCard", data);
            return data;

            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    payInBank(data: any) {
        let url = "/billing/pay_in_bank/Local";
        let seq = this.api.post(url, data);

        seq.subscribe((data: any) => {
            console.log("after payInBank", data);
            return data;

            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    retryPayment(payment: string) {
        let url = "/billing/retry/"+payment;
        let data = {};
        let seq = this.api.post(url,data);

        seq.subscribe((data: any) => {
            console.log("after retryPayment", data);
            return data;

            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    addTransactionCosts(payment: string) {
        let url = "/billing/add_transaction_costs/"+payment;
        let data = {};
        let seq = this.api.post(url,data);

        seq.subscribe((data: any) => {
            console.log("after addTransactionCosts", data);
            return data;

            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }

    payDebit(data: any) {
        let url = "/billing/pay_debit/PayU";
        let seq = this.api.post(url, data);

        seq.subscribe((data: any) => {
            console.log("after payDebit", data);
            return data;

            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }

    payCash(data: any) {
        let url = "/billing/pay_cash/PayU";
        let seq = this.api.post(url, data);

        seq.subscribe((data: any) => {
            console.log("after payCash", data);
            return data;

            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    getRawSources() {
        let url = "/billing/raw_sources/PayU";
        let seq = this.api.get(url);

        seq.subscribe((data: any) => {
            console.log("after getRawSources", data);
            return data;

            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    getPayments(where) {
        let url = "/billing/payments";

        if (where) {
            url = url + "?" + where;
        }
        let seq = this.api.get(url);

        seq.subscribe((data: any) => {
            console.log("after getPayments", data);
            return data;

            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    getBanks() {
        let url = "/payu/banks";
        let seq = this.api.get(url);

        seq.subscribe((data: any) => {
            console.log("after getBanks", data);
            return data;

            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    getPaymentMethods() {
        let url = "/payu/payment_methods";
        let seq = this.api.get(url);

        seq.subscribe((data: any) => {
            console.log("after getPaymentMethods", data);
            return data;

            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
}
