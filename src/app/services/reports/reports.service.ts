import {Injectable} from '@angular/core';
import {ApiService} from '../api/api.service';
import {Report} from '../../models/report';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(public api: ApiService) {}
    
    getReportsFromServer(where: any) {
        let url = "/reports";
        if (where) {
            url = url + "?" + where;
        }
        let seq = this.api.get(url);
        return seq;
    }
    getReports(where: string) {
        let url = "/reports";

        if (where) {
            url = url + "?" + where;
        }
        let seq = this.api.get(url);
        return seq;
    }
    getReportsPrivate(where: string) {
        let url = "/private/reports";

        if (where) {
            url = url + "?" + where;
        }
        let seq = this.api.get(url);
        return seq;
    }
    getNearbyReports(data: any) {
        let url = "/reports/coverage";
        let seq = this.api.get(url, data);
        return seq;
    }
    searchReports(search: string) {
        let url = "/reports/search";

        if (search) {
            url = url + "?search=" + search;
        }
        let seq = this.api.get(url);
        return seq;
    }
    getReport(data: any) {
        let url = "/reports/detail" ;
        let seq = this.api.get(url, data);
        return seq;
    }
    getReportPrivate(data: any) {
        let url = "/private/reports/detail" ;
        let seq = this.api.get(url, data);
        return seq;
    }
    saveReport(report: any) {
        let url = "/reports";
        if (report.id) {
            url = "/reports/" + report.id;
            let seq = this.api.patch(url, report);
            return seq;
        }
        let seq = this.api.post(url, report);
        return seq;
    }
    getReportHash(reportId: string) {
        let url = "/reports/hash/" + reportId;
        let seq = this.api.get(url);
        return seq;
    }
}
