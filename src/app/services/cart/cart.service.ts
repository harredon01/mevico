import { Injectable } from '@angular/core';
import {ApiService} from '../../services/api/api.service';
@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(public api: ApiService) {}

    getCart() {
        let url = "/cart/get";
        let seq = this.api.get(url);

        seq.subscribe((data: any) => {
            console.log("after getCart",data);
            return data;

            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    
    getCheckoutCart() {
        let url = "/cart/checkout";
        let seq = this.api.get(url);

        seq.subscribe((data: any) => {
            console.log("after getCart",data);
            return data;

            // If the API returned a successful response, mark the user as logged in
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
  addCartItem(item: any) {
    let seq = this.api.post('/cart/add', item);
    seq.subscribe((res: any) => {
        console.log("after post addCartItem",res);
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
  updateCartItem(item: any) {
    let seq = this.api.post('/cart/update', item);
    seq.subscribe((res: any) => {
        console.log("after post updateCart",res);
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
  deleteCartItem(item: any) {
    let seq = this.api.post('/cart/update', item);
    seq.subscribe((res: any) => {
        console.log("after deleteCartItem",res);
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
  clearCart() {
    let seq = this.api.post('/cart/clear', {});
    seq.subscribe((res: any) => {
        console.log("after post clearCart",res);
        return res;
    }, err => {
      console.error('ERROR', err);
      this.api.handleError(err);
    });
    return seq;
  }
}
