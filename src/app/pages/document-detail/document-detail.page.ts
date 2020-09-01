import { Component, OnInit } from '@angular/core';
import {DocumentsService} from '../../services/documents/documents.service';
import {NavController, ModalController, AlertController} from '@ionic/angular';
import {Document} from '../../models/document';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../services/api/api.service';
import {BuyerSelectPage} from '../buyer-select/buyer-select.page';
import {ParamsService} from '../../services/params/params.service';
import {UserDataService} from '../../services/user-data/user-data.service';
@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.page.html',
  styleUrls: ['./document-detail.page.scss'],
})
export class DocumentDetailPage implements OnInit {
public documentD: Document;
    public isModal: boolean = false;
    public editing: boolean = false;
    public deniedMsg: string = "";
    constructor(public documents: DocumentsService,
        public alertsCtrl: AlertController,
        public translateService: TranslateService,
        public params: ParamsService,
        public userData: UserDataService,
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public api: ApiService
    ) {
        this.documentD = new Document({});

        let vm = this
        this.translateService.get('BOOKING.DENIED_MSG').subscribe(function (value) {
            vm.deniedMsg = value;
        });
    }

    ngOnInit() {

    }
    
    ionViewDidEnter() {
        let params = this.params.getParams();
        console.log("Params", params);
        if (params) {
            if (params.document) {
                this.documentD = params.document;
            }
            if (params.modal) {
                this.isModal = true;
            }
            if (params.object_id) {
                this.getDocument(params.object_id);
            }
        }
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
    changeStatusDocument(status) {
        if (status == "approved") {
            this.changeStatusServer(status, "");
        } else {
            this.presentAlertDeny();
        }
    }
    changeStatusServer(status, reason) {
        this.api.loader();
        let container = {"object_id": this.documentD.id, "status": status, "reason": reason};
        this.documents.changeStatusDocument(container).subscribe((data: any) => {

            this.api.dismissLoader();
            this.navCtrl.back();
        }, (err) => {
            console.log("Error cancelBooking");
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
    async assignOwner(missing: any) {
        let container = {
            "necessary": missing,
        };
        console.log("BuyerSelectPage", container);

        let addModal = await this.modalCtrl.create({
            component: BuyerSelectPage,
            componentProps: container
        });
        await addModal.present();
        const {data} = await addModal.onDidDismiss();
        if (data == "done") {

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
    async presentAlertDeny() {
        let button = {
            text: 'Ok',
            handler: (data) => {
                console.log('Confirm Okay', data);
                if (data == "no-spec") {
                    this.changeStatusServer("denied", "No es mi especialidad");
                } else {
                    this.changeStatusServer("denied", "No estoy disponible");
                }
            }
        }
        const alert = await this.alertsCtrl.create({
            message: this.deniedMsg,
            inputs: [
                {
                    name: 'radio1',
                    type: 'radio',
                    label: 'No es mi especialidad',
                    value: 'no-spec'
                },
                {
                    name: 'radio2',
                    type: 'radio',
                    label: 'No estoy disponible',
                    value: 'no-disp'
                }
            ],
            buttons: [
                button
            ]
        });
        await alert.present();
    }
    signDocument() {
        let container = {"private_key":"SDFSDf","type":"Document","object_id":this.documentD.id};
        this.documents.signDocument(container).subscribe((data: any) => {
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

    done() {
        this.modalCtrl.dismiss("Close");
    }

}
