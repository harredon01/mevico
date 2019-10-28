import {Injectable} from '@angular/core';
import {ApiService} from '../api/api.service';
@Injectable({
    providedIn: 'root'
})
export class ImagesService {

    constructor(public api: ApiService) {}
    getFiles(data:any) {
        let endpoint = '/imagesapi';
        let seq = this.api.get(endpoint,data);
        return seq;
    }
    deleteFile(data: any) {
        let endpoint = '/imagesapi/'+data;
        let seq = this.api.delete(endpoint, data);
        return seq;
    }
}
