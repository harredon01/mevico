import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {NavController, ToastController, LoadingController} from '@ionic/angular';

import {UserService} from '../../services/user/user.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
account: {
        firstName: string,
        lastName: string,
        docNum: string,
        docType: string,
        area_code: number,
        cellphone: number,
        email: string,
        password: string
        password_confirmation: string,
        language: string,
        city_id: number,
        region_id: number
        country_id: number
    } = {
            firstName: '',
            lastName: '',
            docNum: '',
            docType: '',
            area_code: 57,
            cellphone: null,
            email: '',
            password: '',
            password_confirmation: '',
            language: 'es',
            city_id: 524,
            region_id: 11,
            country_id: 1
        };

    registrationForm: FormGroup;
    submitAttempt: boolean = false;
    passwordError: boolean = false;
    idType: any;
    loading: any;

    // Our translated text strings
    private signupErrorCelString: string;
    private signupErrorIdString: string;
    private signupErrorEmailString: string;
    private signupStartString: string;
  constructor(public navCtrl: NavController,
        public user: UserService,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        public translateService: TranslateService,
        public formBuilder: FormBuilder, private spinnerDialog: SpinnerDialog) {

        this.translateService.get('SIGNUP.ERROR_CEL').subscribe((value) => {
            this.signupErrorCelString = value;
        });
        this.translateService.get('SIGNUP.ERROR_ID').subscribe((value) => {
            this.signupErrorIdString = value;
        });
        this.translateService.get('SIGNUP.ERROR_EMAIL').subscribe((value) => {
            this.signupErrorEmailString = value;
        });
        this.translateService.get('SIGNUP.SAVE_START').subscribe((value) => {
            this.signupStartString = value;
        });
        this.idType = "text";
        this.registrationForm = formBuilder.group({
            docNum: [''],
            docType: [''],
            password: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(6), Validators.required])],
            password_confirmation: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(6), Validators.required])],
            area_code: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[0-9]*'), Validators.required])],
            cellphone: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[0-9._%+-]*'), Validators.required])],
            firstName: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z áúíóéÁÉÍÓÚñÑ]*'), Validators.required])],
            lastName: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z áúíóéÁÉÍÓÚñÑ]*'), Validators.required])],
            email: ['', Validators.compose([Validators.maxLength(100), Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-.]*\.[a-zA-Z]{2,}'), Validators.required])]
        });
    }

  ngOnInit() {
  }
    dismissLoader() {
        if (document.URL.startsWith('http')) {
            this.loadingCtrl.dismiss();
        } else {
            this.spinnerDialog.hide();
        }
    }
  doSignup() {
        this.submitAttempt = true;
        this.passwordError = false;
        console.log("Signing up");
        if (!this.registrationForm.valid) {return;}
        console.log("Registration valid");
        if (this.account.password != this.account.password_confirmation) {
            this.passwordError = true;
            return;
        }
        console.log("Password match");
        this.showLoader();
        // Attempt to login in through our User service
        this.user.signup(this.account).subscribe((resp) => {
            this.dismissLoader();
            console.log("Post login", resp);
            this.user.postLogin().then((value) => {
                console.log("Post login complete");
                this.navCtrl.navigateForward('tabs');
            }, (err) => {
                console.log("Post login error on registration");
            });
        }, (err) => {
            // Unable to sign up
            console.log("Error", err);
            let message = err.error.message;
            let errorString = "";
            if (message.email || message == "email_exists") {
                errorString = this.signupErrorEmailString;
            }
            if (message.docNum || message == "id_exists") {
                errorString = this.signupErrorIdString;
            }
            if (message.celphone || message == "cel_exists") {
                errorString = this.signupErrorCelString;
            }
            let toast = this.toastCtrl.create({
                message: errorString,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
            this.dismissLoader();

        });
    }

    showLoader() {
        if (document.URL.startsWith('http')) {
            this.loading = this.loadingCtrl.create({
                spinner: 'crescent',
                message: this.signupStartString,
                backdropDismiss: true
            }).then(toast => toast.present());
        } else {
            this.spinnerDialog.show(null, this.signupStartString);
        }
    }
    handleRegisError() {
        if (document.URL.startsWith('http')) {
            this.loading = this.loadingCtrl.create({
                spinner: 'crescent',
                message: this.signupStartString,
                backdropDismiss: true
            }).then(toast => toast.present());
        } else {
            this.spinnerDialog.show(null, this.signupStartString);
        }
    }

    selectType() {
        console.log("Select type", this.account.docType);
        if (this.account.docType == "CC" || this.account.docType == "TI" || this.account.docType == "CEL") {
            this.idType = "tel";
        } else {
            this.idType = "text";
        }
    }

}
