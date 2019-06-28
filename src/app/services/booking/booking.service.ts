import {Injectable} from '@angular/core';
import {ApiService} from '../api/api.service';
@Injectable({
    providedIn: 'root'
})
export class BookingService {

    constructor(public api: ApiService) {}
    getBookingsObject(objectId: any) {
        let endpoint = '/bookings/'+objectId;
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
    addBookingObject(data: any) {
        let endpoint = '/bookings';
        let seq = this.api.post(endpoint, data);
        seq.subscribe((data: any) => {
            console.log("after addBookingObject");
            console.log(JSON.stringify(data));
            return data;
            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    cancelBookingObject(objectId: any) {
        let endpoint = '/bookings/'+objectId+'/cancel';
        let seq = this.api.get(endpoint);
        seq.subscribe((data: any) => {
            console.log("after cancelBookingObject");
            console.log(JSON.stringify(data));
            return data;
            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
}
