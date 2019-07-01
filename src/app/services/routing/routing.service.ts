import { Injectable } from '@angular/core';
import {ApiService} from '../api/api.service';
@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(public api: ApiService) {}
  getRoutes(where?: any) {
        let url = "/routes";
        if (where) {
            url = url + "?" + where;
        }
        let seq = this.api.get(url);

        seq.subscribe((data: any) => {
            console.log("after getRoutes",data);
            return data;

            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }
    startRoute(data: any) {
        let endpoint = '/runner/route/start';
        let seq = this.api.post(endpoint, data);
        seq.subscribe((data: any) => {
            console.log("after startRoute");
            console.log(JSON.stringify(data));
            return data;
            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR startRoute', err);
            this.api.handleError(err);
        });
        return seq;
    }
    completeRoute(data: any) {
        let endpoint = '/runner/route/complete';
        let seq = this.api.post(endpoint, data);
        seq.subscribe((data: any) => {
            console.log("after completeRoute");
            console.log(JSON.stringify(data));
            return data;
            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR completeRoute', err);
            this.api.handleError(err);
        });
        return seq;
    }
    stopArrived(data: any) {
        let endpoint = '/runner/stop/arrived';
        let seq = this.api.post(endpoint, data);
        seq.subscribe((data: any) => {
            console.log("after stopArrived");
            console.log(JSON.stringify(data));
            return data;
            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR stopArrived', err);
            this.api.handleError(err);
        });
        return seq;
    }
    stopFailed(data: any) {
        let endpoint = '/runner/stop/failed';
        let seq = this.api.post(endpoint, data);
        seq.subscribe((data: any) => {
            console.log("after stopFailed");
            console.log(JSON.stringify(data));
            return data;
            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR stopFailed', err);
            this.api.handleError(err);
        });
        return seq;
    }
    stopComplete(data: any) {
        let endpoint = '/runner/stop/complete';
        let seq = this.api.post(endpoint, data);
        seq.subscribe((data: any) => {
            console.log("after stopComplete");
            console.log(JSON.stringify(data));
            return data;
            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR stopComplete', err);
            this.api.handleError(err);
        });
        return seq;
    }
}
