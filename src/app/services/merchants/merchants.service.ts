import { Injectable } from '@angular/core';
import {ApiService} from '../api/api.service';
import {Merchant} from '../../models/merchant';
@Injectable({
  providedIn: 'root'
})
export class MerchantsService {

  constructor(public api: ApiService) {}
  
  prepareObjects(objects: any) {
        for (let item in objects) {
                    if (objects[item].object_id) {
                        objects[item].id = objects[item].object_id;
                    }
                    if (objects[item].type) {
//                        objects[item].avatar = 'MERCHANT_' + objects[item].type.toUpperCase();
//                        objects[item].avatar = ICONS[objects[item].avatar];
//                        objects[item].description = $translate.instant('REPORT.' + objects[item].type.toUpperCase());
                    }
                    if (objects[item].Distance) {
                        if (objects[item].Distance < 1) {
                            let result = objects[item].Distance * 100;
                            result = Math.round(result * 100) / 100;
                            objects[item].Distance = result + " m.";
                        } else {
                            let result = objects[item].Distance;
                            result = Math.round(result * 100) / 100;
                            objects[item].Distance = result + " km.";
                        }
                    }
                }
                return objects
    }
    getMerchants(where:string) {
        let url = "/merchants";

        if (where) {
            url = url + "?" + where;
        }
        let seq = this.api.get(url);
        seq.subscribe((data: any) => {
            console.log("after get merchants");
            data.data = this.prepareObjects(data.data);
            console.log(JSON.stringify(data));
            return data;
            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    getMerchant(merchantId:string) {
        let url = "/merchants/"+merchantId;
        let seq = this.api.get(url);
        seq.subscribe((data: any) => {
            console.log("after get merchant");
            console.log(JSON.stringify(data));
            return data;
            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    getMerchantHash(merchantId:string) {
        let url = "/merchant/hash/"+merchantId;
        let seq = this.api.get(url);
        seq.subscribe((data: any) => {
            console.log("after get merchant hash");
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
