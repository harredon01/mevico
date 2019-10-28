import {Component, OnInit} from '@angular/core';
import {NavController, ToastController, ModalController, AlertController, Events, LoadingController} from '@ionic/angular';
import {ParamsService} from '../../services/params/params.service';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {ImagesService} from '../../services/images/images.service';
import {ApiService} from '../../services/api/api.service';
import {ImagePicker} from '@ionic-native/image-picker/ngx';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer/ngx';
@Component({
    selector: 'app-images',
    templateUrl: './images.page.html',
    styleUrls: ['./images.page.scss'],
})
export class ImagesPage implements OnInit {
    images: any[] = [];
    getImagesError = "";
    constructor(public navCtrl: NavController,
        public activatedRoute: ActivatedRoute,
        public imagesServ: ImagesService,
        private transfer: FileTransfer,
        public toastCtrl: ToastController,
        public api: ApiService,
        public modalCtrl: ModalController,
        public alertCtrl: AlertController,
        private spinnerDialog: SpinnerDialog,
        public loadingCtrl: LoadingController,
        public events: Events,
        public params: ParamsService,
        public translateService: TranslateService,
        private imagePicker: ImagePicker) {
        this.translateService.get('IMAGES.GET_ERROR').subscribe((value) => {
            this.getImagesError = value;
        })
    }

    ngOnInit() {
    }
    showLoader() {
        if (document.URL.startsWith('http')) {
            this.loadingCtrl.create({
                spinner: 'crescent',
                backdropDismiss: true
            }).then(toast => toast.present());
        } else {
            this.spinnerDialog.show();
        }
    }
    dismissLoader() {
        if (document.URL.startsWith('http')) {
            this.loadingCtrl.dismiss();
        } else {
            this.spinnerDialog.hide();
        }
    }
    ionViewDidEnter() {
        this.showLoader();
        let params = this.params.getParams();
        let container = {
            type: params.type,
            objectId: params.objectId
        };
        this.images = [];
        this.imagesServ.getFiles(container).subscribe((data: any) => {
            this.dismissLoader();
            console.log("after get addresses");
            let results = data.addresses;
            for (let one in results) {
                this.images.push(results[one]);
            }
            console.log(JSON.stringify(data));
        }, (err) => {
            this.dismissLoader();
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.getImagesError,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
            this.api.handleError(err);
        });
    }
    deleteImage(id) {
        this.showLoader();
        this.imagesServ.deleteFile(id).subscribe((data: any) => {
            this.dismissLoader();
            console.log("after get addresses");
            let results = data.addresses;
            for (let one in results) {
                if(results[one].id == id){
                    this.images.splice(parseInt(one),1);
                }
            }
            console.log(JSON.stringify(data));
        }, (err) => {
            this.dismissLoader();
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.getImagesError,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
            this.api.handleError(err);
        });
    }
    done(){
        this.navCtrl.back();
    }
    openImages() {
        let params = this.params.getParams();
        let container = {
            type: params.type,
            objectId: params.objectId
        };
        const fileTransfer: FileTransferObject = this.transfer.create();
        let options = {
            // max width and height to allow the images to be.  Will keep aspect
            // ratio no matter what.  So if both are 800, the returned image
            // will be at most 800 pixels wide and 800 pixels tall.  If the width is
            // 800 and height 0 the image will be 800 pixels wide if the source
            // is at least that wide.
            width: 800,
            height: 800,
            // output type, defaults to FILE_URIs.
            // available options are 
            // window.imagePicker.OutputType.FILE_URI (0) or 
            // window.imagePicker.OutputType.BASE64_STRING (1)
            outputType: 0
        };
        this.imagePicker.getPictures(options).then((results) => {
            for (var i = 0; i < results.length; i++) {
                console.log('Image URI: ' + results[i]);
                this.upload(fileTransfer, results[i],container);
            }
        }, (err) => {});
    }
    upload(fileTransfer, path,params) {
        let options: FileUploadOptions = {
            fileKey: 'file',
            fileName: 'image.jpg',
            headers: this.api.buildHeaders(null),
            params: params
        }

        fileTransfer.upload(path, 'api/imagesapi', options)
            .then((data) => {
                console.log("Success upload",data)
            }, (err) => {
                console.log("Error upload",err)
            })
    }

}
