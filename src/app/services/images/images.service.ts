import {Injectable} from '@angular/core';
import {ApiService} from '../api/api.service';
@Injectable({
    providedIn: 'root'
})
export class ImagesService {

    constructor(public api: ApiService) {}
    getFiles(data:any) {
        let endpoint = '/bookings/user';
        let seq = this.api.get(endpoint,data);
        return seq;
    }
    deleteFile(data: any) {
        let endpoint = '/bookings';
        let seq = this.api.delete(endpoint, data);
        return seq;
    }
}
