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
        return seq;
    }
    getRouteInfo(delivery) {
      let seq = this.api.get(`/food/route_detail/`+delivery);
      return seq;
  }
}
