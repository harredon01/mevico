import {Injectable} from '@angular/core';
import {ApiService} from '../api/api.service';
@Injectable({
    providedIn: 'root'
})
export class BookingService {

    constructor(public api: ApiService) {}
    getBookingsObject(objectB: any) {
        let endpoint = '/bookings';
        let seq = this.api.get(endpoint,objectB);
        return seq;
    }
    addBookingObject(data: any) {
        let endpoint = '/bookings';
        let seq = this.api.post(endpoint, data);
        return seq;
    }
    approveBookingObject(data: any) {
        let endpoint = '/bookings/approve';
        let seq = this.api.post(endpoint, data);
        return seq;
    }
    cancelBookingObject(objectId: any) {
        let endpoint = '/bookings/'+objectId+'/cancel';
        let seq = this.api.get(endpoint);
        return seq;
    }
}
