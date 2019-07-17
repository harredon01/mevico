import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavController, IonContent, ToastController} from '@ionic/angular';

import {AuthService} from '../../services/auth/auth.service';
@Component({
    selector: 'app-medical',
    templateUrl: './medical.page.html',
    styleUrls: ['./medical.page.scss'],
})
export class MedicalPage implements OnInit {
    @ViewChild(IonContent) content: IonContent;
    data: any = {};
    showForm = false;
    medicalSuccess:string = "";
    medicalError:string = "";
    showProfile = false;
    genders = [
        {name: "M", value: "m"},
        {name: "F", value: "f"}
    ];
    bloods = [
        {name: "A", value: "a"},
        {name: "O", value: "o"},
        {name: "B", value: "b"},
        {name: "AB", value: "ab"}
    ];
    antigens = [
        {name: "+", value: "+"},
        {name: "-", value: "-"}
    ];
    constructor(public auth: AuthService, public navCtrl: NavController, public toastCtrl: ToastController, public translateService: TranslateService) {
        this.translateService.get('MEDICAL.SUCCESS').subscribe((value) => {
            this.medicalSuccess = value;
        });
        this.translateService.get('MEDICAL.ERROR').subscribe((value) => {
            this.medicalError = value;
        });
    }

    ngOnInit() {
    }
    toggleForm() {
        if (this.showProfile == true) {
            if (this.showForm == true) {
                this.showForm = false;
            } else {
                this.showForm = true;
                this.content.scrollToBottom(300);
            }
        }
    }
    update() {
        console.log("Sending");
        console.log(JSON.stringify(this.data));
        this.data.birth = this.data.birthYear + "-" + this.data.birthMonth + "-" + this.data.birthDay;
        this.auth.updateMedical(this.data).subscribe((resp: any) => {
            if (resp.status = "success") {
                this.toastCtrl.create({
                    message: this.medicalSuccess,
                    duration: 3000,
                    position: 'top'
                }).then(toast => toast.present());
                this.showForm = false;
            } else {
                this.toastCtrl.create({
                    message: this.medicalError,
                    duration: 3000,
                    position: 'top'
                }).then(toast => toast.present());
            }
        }, (err) => {
            console.error('ERR', err);
            console.log(JSON.stringify(err));
            // err.status will contain the status code
        });
        // console.log( this.data );
    }
    verify() {
        let formData = {password: this.data.password};
        this.auth.verifyMedical(this.data).subscribe((resp: any) => {
            this.showProfile = true;
            console.log(JSON.stringify(resp));
            this.data = resp;
            var birthdate = new Date(this.data.birth);
            this.data.birthDay = birthdate.getDate() + 1;
            this.data.birthMonth = birthdate.getMonth() + 1;
            this.data.birthYear = birthdate.getFullYear();
            this.data.password = formData.password;
        }, (err) => {
            this.toastCtrl.create({
                message: this.medicalError,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
        });
    }
}
