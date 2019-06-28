import { Injectable } from '@angular/core';
import {ApiService} from '../api/api.service';
@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(public api: ApiService) {}
  getAddresses(where?: any) {
        let url = "/routes";
        if (where) {
            url = url + "?" + where;
        }
        let seq = this.api.get(url);

        seq.subscribe((data: any) => {
            console.log("after get Addresses",data);
            return data;

            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
}
