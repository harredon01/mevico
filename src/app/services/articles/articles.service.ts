import { Injectable } from '@angular/core';
import {ApiService} from '../api/api.service';
@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(public api: ApiService) {}
  
  getArticles(where: any) {
        let url = "/articles";
        if (where) {
            url = url + "?" + where;
        }
        let seq = this.api.get(url);
        return seq;
    }
}
