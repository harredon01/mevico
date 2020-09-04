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
    getDocuments(where?: string)  {
        let endpoint = '/documents';
        if(where){
            endpoint = '/documents?'+where;
        }
        let seq = this.api.get(endpoint );
        return seq;
    }
    saveOrCreateDocument(data: any) {
        let endpoint = '/documents';
        let seq = this.api.post(endpoint, data);
        return seq;
    }
    signDocument(data: any,document_id: any) {
        let endpoint = '/documents/' + document_id+"/sign";
        let seq = this.api.post(endpoint, data);
        return seq;
    }

    verifySignatures(document_id: any) {
        let endpoint = '/documents/' + document_id+"/verify_signature";
        let seq = this.api.post(endpoint, {});
        return seq;
    }
    deleteDocument(objectId: any) {
        let endpoint = '/documents/'+objectId;
        let seq = this.api.delete(endpoint);
        return seq;
    }
}
