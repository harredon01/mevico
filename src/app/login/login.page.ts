import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavController, ToastController, LoadingController} from '@ionic/angular';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';

import {UserService} from '../services/user/user.service';
import {UserDataService} from '../services/user-data/user-data.service';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    // The account fields for the login form.
    // If you're using the username field with or without email, make
    // sure to add it to the type
    account: {username: string, password: string, remember: boolean} = {
        username: '',
        password: '',
        remember: true
    };
    public downloadProgress = 0;
    loading: any;

    // Our translated text strings
    private loginErrorString: string;
    private loginStartString: string;
    // Our translated text strings
    private updateErrorString: string;
    private updateStartString: string;
    private isUpdating: boolean;
    constructor(public spinnerDialog: SpinnerDialog,
        public navCtrl: NavController,
        public user: UserService,
        public loadingCtrl: LoadingController,
        public userData: UserDataService,
        public iab: InAppBrowser,
        public toastCtrl: ToastController,
        public translateService: TranslateService) {
        this.isUpdating = false;

        this.translateService.get('LOGIN.LOGIN_ERROR').subscribe((value) => {
            this.loginErrorString = value;
        });
        this.translateService.get('LOGIN.LOGIN_START').subscribe((value) => {
            this.loginStartString = value;
        });
        this.translateService.get('LOGIN.UPDATE_ERROR').subscribe((value) => {
            this.updateErrorString = value;
        });
        this.translateService.get('LOGIN.UPDATE_START').subscribe((value) => {
            this.updateStartString = value;
        });
        this.checkLogIn();
    }

    ngOnInit() {
    }
    checkLogIn() {
        this.showLoaderEmpty();
        this.userData.getToken().then((value) => {
            console.log("getToken");
            console.log(value);
            if (value) {
                this.userData.setToken(value);
                this.user.postLogin().then((value) => {
                    if (document.URL.startsWith('http')) {
                        if (this.loading) {
                            this.loading.dismiss();
                        }
                    } else {
                        this.spinnerDialog.hide();
                    }
                    this.navCtrl.navigateRoot("tabs");
                }, (err) => {
                    this._loadUserData();
                    // Unable to log in
                    let toast = this.toastCtrl.create({
                        message: this.loginErrorString,
                        duration: 3000,
                        position: 'top'
                    }).then(toast => toast.present());
                });

            } else {
                this._loadUserData();
            }
        });
    }

    // Attempt to login in through our User service
    doLogin() {
        console.log("doLogin");
        this.showLoaderEmpty();
        this.user.login(this.account).subscribe((resp) => {
            this.user.postLogin().then((value) => {
                if (document.URL.startsWith('http')) {
                    if (this.loading) {
                        this.loading.dismiss();
                    }
                } else {
                    this.spinnerDialog.hide();
                }
                console.log("Post login complete");
                this.navCtrl.navigateRoot("tabs");
            }, (err) => {
                console.log("Post login error on registration");
            });
        }, (err) => {
            if (document.URL.startsWith('http')) {
                if (this.loading) {
                    this.loading.dismiss();
                }
            } else {
                this.spinnerDialog.hide();
            }
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.loginErrorString,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
        });
    }
    forgotPass() {
        const browser = this.iab.create("https://lonchis.com.co/password/reset");
        browser.on('exit').subscribe(event => {
        });
    }
    // Attempt to login in through our User service
    _loadUserData() {
        if (document.URL.startsWith('http')) {
            if (this.loading) {
                this.loading.dismiss();
            }

        } else {
            this.spinnerDialog.hide();
        }
        this.userData.getUsername().then((value) => {
            console.log("getUsername", value);
            if (value) {
                this.account.username = value;
            }
        });
        this.userData.getPassword().then((value) => {
            console.log("getPassword", value);
            if (value) {
                this.account.password = value;
            }
        });
        this.userData.getRemember().then((value) => {
            console.log("getRemember", value);
            if (value) {
                if (value == "true") {
                    this.account.remember = true;
                } else if (value == "false") {
                    this.account.remember = false;
                }
                console.log("getRememberRes", this.account.remember);
            }
        });
    }

    singup() {
        console.log("Signup")
        this.navCtrl.navigateForward("signup");
    }

    async showLoader() {
        if (document.URL.startsWith('http')) {
            this.loading = await this.loadingCtrl.create({
                spinner: 'crescent',
                message: this.loginStartString,
                backdropDismiss: true
            });
            await this.loading.present();
        } else {
            this.spinnerDialog.show(null, this.loginStartString);
        }
    }
    async showLoaderEmpty() {
        console.log("showloaderempty");
        this.isUpdating = true;
        if (document.URL.startsWith('http')) {
            this.loading = await this.loadingCtrl.create({
                spinner: 'crescent',
                backdropDismiss: true
            });
            await this.loading.present();
        } else {
            this.spinnerDialog.show();
        }
    }

}
