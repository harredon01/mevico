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
    getObjectsWithBookingUser() {
        let endpoint = '/bookings/user';
        let seq = this.api.get(endpoint);
        return seq;
    }
    addBookingObject(data: any) {
        let endpoint = '/bookings';
        let seq = this.api.post(endpoint, data);
        return seq;
    }
    immediateBookingObject(data: any) {
        let endpoint = '/bookings/now';
        let seq = this.api.post(endpoint, data);
        return seq;
    }
    getAvailabilitiesObject(data: any)  {
        let url = "/availabilities";
        let seq = this.api.get(url,data);
        return seq;
    }
    saveOrCreateAvailability(data: any) {
        let endpoint = '/availabilities';
        let seq = this.api.post(endpoint, data);
        return seq;
    }
    deleteAvailability(data: any) {
        let endpoint = '/availabilities';
        let seq = this.api.delete(endpoint,data);
        return seq;
    }
    changeStatusBookingObject(data: any) {
        let endpoint = '/bookings/status';
        let seq = this.api.post(endpoint, data);
        return seq;
    }
    recheduleBookingObject(data: any) {
        let endpoint = '/bookings/schedule';
        let seq = this.api.post(endpoint, data);
        return seq;
    }
    registerConnection(data: any) {
        let endpoint = '/bookings/connection';
        let seq = this.api.post(endpoint, data);
        return seq;
    }
    leaveCall(data: any) {
        let endpoint = '/bookings/connection_end';
        let seq = this.api.post(endpoint, data);
        return seq;
    }
    cancelBookingObject(objectId: any) {
        let endpoint = '/bookings/'+objectId+'/cancel';
        let seq = this.api.get(endpoint);
        return seq;
    }
}
