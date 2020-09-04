import {Component, OnInit} from '@angular/core';
import {DocumentsService} from '../../services/documents/documents.service';
import {NavController, ModalController, AlertController} from '@ionic/angular';
import {Document} from '../../models/document';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api/api.service';
import {BuyerSelectPage} from '../buyer-select/buyer-select.page';
import {ParamsService} from '../../services/params/params.service';
import {UserDataService} from '../../services/user-data/user-data.service';
import {ArticlesService} from '../../services/articles/articles.service'
@Component({
    selector: 'app-document-detail',
    templateUrl: './document-detail.page.html',
    styleUrls: ['./document-detail.page.scss'],
})
export class DocumentDetailPage implements OnInit {
    public documentD: Document;
    public isModal: boolean = false;
    public editing: boolean = false;
    public addingField: boolean = false;
    public newField: {
        "code": string,
        "name": string,
        "type": string
    } = {
            "code": "",
            "name": "",
            "type": ""
        };
    public typeSelectorTitle: string = "";
    public availableFormats: any[] = [];
    public formatTypes: any[] = [];
    constructor(public documents: DocumentsService,
        public alertsCtrl: AlertController,
        public translateService: TranslateService,
        public params: ParamsService,
        public userData: UserDataService,
        public articles: ArticlesService,
        public activatedRoute: ActivatedRoute,
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public api: ApiService
    ) {
        this.documentD = new Document({});
        //        this.newField = {
        //            "code": "",
        //            "name": "",
        //            "type": ""
        //        };
        let vm = this
        this.translateService.get('DOCUMENT_DETAIL.TYPE_SELECTOR_TITLE').subscribe(function (value) {
            vm.typeSelectorTitle = value;
        });
    }

    ngOnInit() {
        let merchantId = this.activatedRoute.snapshot.paramMap.get('objectId');
        let is_new = false;
        if (merchantId) {
            if (merchantId == "-1") {
                is_new = true;
            }
        }
        this.getFormats(is_new);
    }
    pluck(array, key) {
        return array.map(o => o[key]);
    }

    ionViewDidEnter() {
        let params = this.params.getParams();
        console.log("Params", params);
        let found = false;
        if (params) {
            if (params.item) {
                found = true;
                this.documentD = params.item;
            }
            if (params.modal) {
                this.isModal = true;
            }
        }
        if(!found){
            let merchantId = this.activatedRoute.snapshot.paramMap.get('objectId');
            if (merchantId){
                this.getDocument(merchantId);
            }
        }
    }
    getFormats(is_new: boolean) {
        this.api.loader();
        let searchObj = null;
        let query = "category_id=26&order_by=category_id,asc";
        searchObj = this.articles.getArticles(query);
        searchObj.subscribe((data: any) => {
            let results = data.data;
            for (let one in results) {

                let container = JSON.parse(results[one].body);
                this.availableFormats = this.availableFormats.concat(container);
            }
            this.formatTypes = this.pluck(this.availableFormats, 'type');
            if (is_new) {
                this.presentAlertRadio();
            }
            this.api.dismissLoader();
        }, (err) => {
            console.log("Error getArticles");
            this.api.dismissLoader();
            // Unable to log in
            this.api.toast('CATEGORIES.ERROR_GET');
            this.api.handleError(err);
        });
    }
    deleteDocument() {
        this.api.loader();
        this.documents.deleteDocument(this.documentD.id).subscribe((resp: any) => {
            this.api.dismissLoader();
            console.log("deleteDocument", resp);
            //this.presentAlertConfirm(data);
            if (resp.status == "success") {
                this.navCtrl.back();
            } else {
                if (resp.message == "Not Available") {

                }
            }
        }, (err) => {
            console.log("Error deleteDocument");
            this.api.dismissLoader();
            this.api.handleError(err);
        });
    }
    buildDocumentResult(data: any) {
        if (data.status == "success") {
            let result = data.document;
            console.log("building booking");
            this.documentD = new Document(result);
        } else if (data.status == "denied") {
            this.navCtrl.navigateBack("tabs/settings/bookings");
        }

    }
    getDocument(object_id: any) {
        this.api.loader();
        this.documents.getDocument(object_id).subscribe((data: any) => {
            this.buildDocumentResult(data);
            this.api.dismissLoader();
        }, (err) => {
            console.log("Error cancelBooking");
            this.api.dismissLoader();
            this.api.handleError(err);
        });
    }

    editDocument() {
        this.editing = true;
    }
    cancelEditing() {
        this.editing = false;
    }
    async assignOwner() {
        let container = {
            "necessary": 1,
        };
        this.params.setParams(container);
        console.log("BuyerSelectPage", container);

        let addModal = await this.modalCtrl.create({
            component: BuyerSelectPage,
            componentProps: container
        });
        await addModal.present();
        const {data} = await addModal.onDidDismiss();
        if (data.status == "success") {
            this.documentD.user_id = data.users[0].user_id
            this.saveDocument();
        }
    }


    showAlertTranslation(alert) {
        this.translateService.get(alert).subscribe(
            value => {
                this.presentAlertConfirm(value);
            }
        )
    }

    async presentAlertConfirm(message) {
        console.log("Present alert", message);
        let button = {
            text: 'Ok',
            handler: () => {
                console.log('Confirm Okay');
            }
        }
        const alert = await this.alertsCtrl.create({
            message: message,
            buttons: [
                button
            ]
        });
        await alert.present();
    }
    async presentAlertRadio() {
        let inputs = [];
        for (let i in this.formatTypes) {
            let container = {
                name: this.formatTypes[i],
                type: 'radio',
                label: this.formatTypes[i],
                value: this.formatTypes[i]
            }
            inputs.push(container)
        }
        const alert = await this.alertsCtrl.create({
            header: this.typeSelectorTitle,
            inputs: inputs,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Ok',
                    handler: (data) => {
                        this.addType(data);
                        console.log('Confirm Ok', data);
                        this.editing = true;
                    }
                }
            ]
        });

        await alert.present();
    }

    async presentAlertDeny() {

    }
    saveDocument() {
        if (this.documentD.title.length == 0) {
            this.api.toast("DOCUMENT.REQUIRES_TITLE");
            return null
        }
        this.documents.saveOrCreateDocument(this.documentD).subscribe((data: any) => {
            if (data.status == "success") {
                this.documentD = data.document;
                this.editing = false;
            } else {
                this.showAlertTranslation("DOCUMENT." + data.message);
            }
        }, (err) => {
            console.log("Error cancelBooking");
            this.api.dismissLoader();
            this.api.handleError(err);
        });
    }
    signDocument() {
        let container = {"private_key": "SDFSDf", "type": "Document", "object_id": this.documentD.id};
        this.documents.signDocument(this.documentD.id, container).subscribe((data: any) => {
            if (data.status == "success") {

            } else {
                this.showAlertTranslation("BOOKING." + data.message);
            }
        }, (err) => {
            console.log("Error cancelBooking");
            this.api.dismissLoader();
            this.api.handleError(err);
        });
    }
    verifySignatures() {
        this.documents.verifySignatures(this.documentD.id).subscribe((data: any) => {
            if (data.status == "success") {

            } else {
                this.showAlertTranslation("DOCUMENT." + data.message);
            }
        }, (err) => {
            console.log("Error cancelBooking");
            this.api.dismissLoader();
            this.api.handleError(err);
        });
    }

    done() {
        this.modalCtrl.dismiss("Close");
    }
    addType(type_selected: any) {
        this.availableFormats
        for (let i in this.availableFormats) {
            let container = this.availableFormats[i];
            if (container.type == type_selected) {
                this.documentD.body = this.documentD.body.concat(container.questions);
            }
        }
    }
    addField() {
        this.addingField = true;
    }
    cancelAddField() {
        this.newField = {
            "code": "",
            "name": "",
            "type": ""
        };
        this.addingField = false;
    }
    saveField() {
        let container = this.newField;
        this.newField = {
            "code": "",
            "name": "",
            "type": ""
        };
        this.addingField = false;
        this.documentD.body.push(container);
    }
    clear() {
        this.documentD.body = [];
    }
    delete(item: any) {
        this.documentD.body.splice(this.documentD.body.indexOf(item), 1);
    }

}
