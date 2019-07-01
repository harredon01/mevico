import { Injectable } from '@angular/core';
import {ApiService} from '../api/api.service';
@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(public api:ApiService) { }
  getArticlesByDate(item?: any) {
        let url = '/articles?start_date='+item
        let seq = this.api.get(url);

        seq.subscribe((data: any) => {
            console.log("after getArticlesByDate",data);
            return data;

            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR getArticlesByDate', err);
            this.api.handleError(err);
        });
        return seq;
    }
}
