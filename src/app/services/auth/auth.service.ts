import { Injectable } from '@angular/core';
import {ApiService} from '../api/api.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public api: ApiService) {}
  
  verifyMedical2(user: any) {
        let endpoint = '/auth/verify_medical';
        let seq = this.api.get(endpoint);
        seq.subscribe((data: any) => {
            console.log("after getBookingsObject");
            console.log(JSON.stringify(data));
            return data;
            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    verifyMedical(user: any) {
        let endpoint = '/auth/verify_medical';
        let seq = this.api.post(endpoint, user);
        seq.subscribe((data: any) => {
            console.log("after verifyMedical");
            console.log(JSON.stringify(data));
            return data;
            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERRORverifyMedical', err);
            this.api.handleError(err);
        });
        return seq;
    }
    verifyCodes(formData: any) {
        let endpoint = '/auth/verify_codes';
        let seq = this.api.post(endpoint, formData);
        seq.subscribe((data: any) => {
            console.log("after verifyCodes");
            console.log(JSON.stringify(data));
            return data;
            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR verifyCodes', err);
            this.api.handleError(err);
        });
        return seq;
    }
    validateCodes(code: any) {
        let endpoint = '/auth/validate_codes';
        let codes = {code: code};
        let seq = this.api.post(endpoint, codes);
        seq.subscribe((data: any) => {
            console.log("after validateCodes");
            console.log(JSON.stringify(data));
            return data;
            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR validateCodes', err);
            this.api.handleError(err);
        });
        return seq;
    }
    /**
     * Send a POST request to our login endpoint with the data
     * the user entered on the form.
     */
    updatePassword(passwordData: any) {
        let seq = this.api.post('/user/change_password', passwordData);
        seq.subscribe((data: any) => {
            console.log("after update password");
            console.log(JSON.stringify(data));
            return data;
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });

        return seq; 
    }
    /**
     * Send a POST request to our login endpoint with the data
     * the user entered on the form.
     */
    updateMedical(medical: any) {
        let seq = this.api.post('/auth/update_medical', medical);
        seq.subscribe((data: any) => {
            console.log("after updateMedical");
            console.log(JSON.stringify(data));
            return data;
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });

        return seq; 
    }
    /**
     * Send a POST request to our login endpoint with the data
     * the user entered on the form.
     */
    updateCodes(codes: any) {
        let seq = this.api.post('/auth/update_codes', codes);
        seq.subscribe((data: any) => {
            console.log("after updateCodes");
            console.log(JSON.stringify(data));
            return data;
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });

        return seq; 
    }
    /**
     * Send a POST request to our login endpoint with the data
     * the user entered on the form.
     */
    logout() {
        let seq = this.api.get('/auth/logout');
        seq.subscribe((data: any) => {
            console.log("after logout");
            console.log(JSON.stringify(data));
            return data;
        }, err => {
            console.error('ERROR logout', err);
            this.api.handleError(err);
        });

        return seq; 
    }
}
