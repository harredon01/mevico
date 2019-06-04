import { Injectable } from '@angular/core';
import {ApiService} from '../api/api.service';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(public api: ApiService) {}


    /**
      * Send a POST request to our signup endpoint with the data
      * the user entered on the form.
      */
    setShippingAddress(shipping: any) {
        let seq = this.api.post('/orders/shipping', shipping);
        seq.subscribe((res: any) => {
            console.log("after post setShippingAddress", res);
            return res;
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    
    /**
      * Send a POST request to our signup endpoint with the data
      * the user entered on the form.
      */
    setOrderRecurringType(order_id: any,recurring: any) {
        let seq = this.api.post('/orders/recurring/'+order_id, recurring);
        seq.subscribe((res: any) => {
            console.log("after post setOrderRecurringType", res);
            return res;
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    /**
      * Send a POST request to our signup endpoint with the data
      * the user entered on the form.
      */
    setPlatformShippingCondition(order: any,platform:any) {
        let shipping = {};
        let seq = this.api.post('/orders/platform/shipping/'+order+"/"+platform, shipping);
        seq.subscribe((res: any) => {
            console.log("after setPlatformShippingCondition", res);
            return res;
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    /**
     * Send a POST request to our signup endpoint with the data
     * the user entered on the form.
     */
    setPayerAddress(shipping: any) {
        let seq = this.api.post('/orders/shipping', shipping);
        seq.subscribe((res: any) => {
            console.log("after post addToCart", res);
            return res;
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    /**
     * Send a POST request to our signup endpoint with the data
     * the user entered on the form.
     */
    updateCart(accountInfo: any) {
        let seq = this.api.post('/cart/update', accountInfo);
        seq.subscribe((res: any) => {
            console.log("after post updateCart", res);
            return res;
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    /**
     * Send a POST request to our signup endpoint with the data
     * the user entered on the form.
     */
    deleteCartItem(accountInfo: any) {
        let seq = this.api.post('/cart/update', accountInfo);
        seq.subscribe((res: any) => {
            console.log("after deleteCartItem", res);
            return res;
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    /**
     * Send a POST request to our signup endpoint with the data
     * the user entered on the form.
     */
    clearCart(accountInfo: any) {
        let seq = this.api.post('/cart/clear', accountInfo);
        seq.subscribe((res: any) => {
            console.log("after post clearCart", res);
            return res;
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }

    /**
     * Send a POST request to our signup endpoint with the data
     * the user entered on the form.
     */
    prepareOrder(accountInfo: any) {
        let seq = this.api.post('/orders/prepare/food', accountInfo);
        seq.subscribe((res: any) => {
            console.log("after post prepareOrder", res);
            return res;
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    /**
     * Send a POST request to our signup endpoint with the data
     * the user entered on the form.
     */
    setDiscounts(order: any) {
        let seq = this.api.post('/orders/discounts/food/'+order, {});
        seq.subscribe((res: any) => {
            console.log("after post setDiscounts", res);
            return res;
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    
    /**
     * Send a POST request to our signup endpoint with the data
     * the user entered on the form.
     */
    setCoupon(coupon: any) {
        let seq = this.api.post('/orders/coupon', {"coupon":coupon});
        seq.subscribe((res: any) => {
            console.log("after post setCoupon", res);
            return res;
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    /**
     * Send a POST request to our signup endpoint with the data
     * the user entered on the form.
     */
    checkOrder(order: any,data:any) { 
        let seq = this.api.post('/orders/check/'+order, data);
        seq.subscribe((res: any) => {
            console.log("after post setDiscounts", res);
            return res;
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    
    /**
     * Send a POST request to our signup endpoint with the data
     * the user entered on the form.
     */
    getOrders(where:any) { 
        let url = '/orders';
        if(where){
            url = url+"?"+where;
        }
        let seq = this.api.get(url);
        seq.subscribe((res: any) => {
            console.log("after getUserOrders", res);
            return res;
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
}
