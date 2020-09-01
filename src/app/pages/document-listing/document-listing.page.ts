import {Component, OnInit} from '@angular/core';
import {Document} from '../../models/document';
import {ApiService} from '../../services/api/api.service';
import {ParamsService} from '../../services/params/params.service';
import {DocumentsService} from '../../services/documents/documents.service';
import { NavController} from '@ionic/angular';
@Component({
    selector: 'app-document-listing',
    templateUrl: './document-listing.page.html',
    styleUrls: ['./document-listing.page.scss'],
})
export class DocumentListingPage implements OnInit {
    currentItems: any[] = [];
    loading: any;
    constructor(public documents: DocumentsService,
        public navCtrl: NavController,
        public params: ParamsService,
        public api: ApiService) {
    }

    ngOnInit() {
    }
    ionViewDidEnter() {
        this.api.loader();
        this.currentItems = [];
        this.documents.getDocuments().subscribe((data: any) => {
            this.api.dismissLoader();
            console.log("after get addresses");
            let results = data.data;
            for (let one in results) {
                let container = new Document(results[one])
                this.currentItems.push(container);
            }
            console.log(JSON.stringify(data));
        }, (err) => {
            this.api.dismissLoader();
            // Unable to log in
            this.api.toast('INPUTS.ERROR_GET');
            this.api.handleError(err);
        });
    }
    openItem(item: Document) {
        console.log("Open document", item);
        let param = {"item": item};
        this.params.setParams(param);
        this.navCtrl.navigateForward('tabs/settings/documents/' + item.id);
    }
}
