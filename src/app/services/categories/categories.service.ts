import {Injectable} from '@angular/core';
import {ApiService} from '../api/api.service';
@Injectable({
    providedIn: 'root'
})
export class CategoriesService {

    constructor(public api: ApiService) {}

    getCategories(typeCategory: any) {
        let url = "/categories/" + typeCategory;
        let seq = this.api.get(url);

        seq.subscribe((data: any) => {
            console.log("after get Categories", data);
            return data;

            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    
    searchCategories(data: any) {
        let url = "/categories/search" ;
        let seq = this.api.post(url,data);
        seq.subscribe((data: any) => {
            console.log("after get Categories", data);
            return data;

            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
}
