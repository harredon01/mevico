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
    selectedSearch:any = "Owner";
    loading: any;
    page:any = 0;
    constructor(public documents: DocumentsService,
        public navCtrl: NavController,
        public params: ParamsService,
        public api: ApiService) {
    }

    ngOnInit() {
    }
    selectType() {
        this.page = 0
        this.currentItems = [];
        this.getItems();
    }
    ionViewDidEnter() {
        this.api.loader();
        this.currentItems = [];
        this.getItems();
    }
    getItems(event?) {
        this.api.loader();
        this.page ++;
        let where = 'includes=user,author,files,signatures&page='+this.page;
        if(this.selectedSearch == "Author"){
            where += '&author_id=-1'
        }
        this.documents.getDocuments(where).subscribe((data: any) => {
            this.api.dismissLoader();
            console.log("after get addresses");
            let results = data.data;
            for (let one in results) {
                let container = new Document(results[one])
                this.currentItems.push(container);
            }
            if (event) {
                event.target.complete();
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
        this.navCtrl.navigateForward('shop/settings/documents/' + item.id);
    }
    createDocument() {
        console.log("Open document", null);
        let param = {"item": null,"is_new":true};
        this.params.setParams(param);
        this.navCtrl.navigateForward('shop/settings/documents/-1');
    }
}
