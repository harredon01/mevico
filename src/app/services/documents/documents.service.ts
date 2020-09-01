import { Injectable } from '@angular/core';
import {ApiService} from '../api/api.service';
@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  constructor(public api: ApiService) { }
  
    getDocument(objectB: any) {
        let endpoint = '/documents/'+objectB;
        let seq = this.api.get(endpoint );
        return seq;
    }
    getDocuments() {
        let endpoint = '/documents';
        let seq = this.api.get(endpoint );
        return seq;
    }
    saveOrCreateDocument(data: any) {
        let endpoint = '/documents';
        let seq = this.api.post(endpoint, data);
        return seq;
    }
    signDocument(data: any) {
        let endpoint = '/documents/sign';
        let seq = this.api.post(endpoint, data);
        return seq;
    }

    changeStatusDocument(data: any) {
        let endpoint = '/documents/status';
        let seq = this.api.post(endpoint, data);
        return seq;
    }
    deleteDocument(objectId: any) {
        let endpoint = '/documents/'+objectId;
        let seq = this.api.delete(endpoint);
        return seq;
    }
}
