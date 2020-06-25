import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import {NavController, ToastController, LoadingController, AlertController, ModalController} from '@ionic/angular';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {Events} from '../../services/events/events.service';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {UserService} from '../../services/user/user.service';
import {UserDataService} from '../../services/user-data/user-data.service';
import {AuthService} from '../../services/auth/auth.service';
import {ApiService} from '../../services/api/api.service';
import {MapDataService} from '../../services/map-data/map-data.service';
import {ParamsService} from '../../services/params/params.service';
import {ForgotPassPage} from '../forgot-pass/forgot-pass.page';
import {DynamicRouterService} from '../../services/dynamic-router/dynamic-router.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    // The account fields for the login form.
    // If you're using the username field with or without email, make
    // sure to add it to the type
    account: {username: string, password: string, client_secret: string, grant_type: string, scope: string, remember: boolean, client_id: any} = {
        username: '',
        password: '',
        client_secret: "nuoLagU2jqmzWqN6zHMEo82vNhiFpbsBsqcs2DPt",
        grant_type: 'password',
        scope: "*",
        remember: true,
        client_id: 1
    };
    public downloadProgress = 0;
    loading: any;

    // Our translated text strings
    private loginErrorString: string;
    private loginStartString: string;
    public showGuest: boolean = false;
    // Our translated text strings
    private updateErrorString: string;
    private updateStartString: string;
    private forgotErrorString: string;
    private forgotString: string;
    private isUpdating: boolean;
    constructor(public spinnerDialog: SpinnerDialog,
        public navCtrl: NavController,
        private googlePlus: GooglePlus,
        private fb: Facebook,
        private params: ParamsService,
        public user: UserService,
        public api: ApiService,
        private mapData:MapDataService,
        public dr: DynamicRouterService,
        private alertsCtrl: AlertController,
        private modalCtrl: ModalController,
        public auth: AuthService,
        public events: Events,
        public loadingCtrl: LoadingController,
        public userData: UserDataService,
        public iab: InAppBrowser,
        public toastCtrl: ToastController,
        public translateService: TranslateService) {
        this.isUpdating = false;

        this.translateService.get('LOGIN.LOGIN_ERROR').subscribe((value) => {
            this.loginErrorString = value;
        });
        this.translateService.get('LOGIN.FORGOT').subscribe((value) => {
            this.forgotString = value;
        });
        this.translateService.get('LOGIN.FORGOT_ERROR').subscribe((value) => {
            this.forgotErrorString = value;
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
    ionViewDidEnter() {
        this.showGuest = false;
        let container = this.dr.pages;
        console.log("Checking for guest: ",container);
        if (container.includes("checkout")) {
            this.showGuest = true;
        }
    }
    async dismissLoader() {
        if (document.URL.startsWith('http')) {
            let topLoader = await this.loadingCtrl.getTop();
            while (topLoader) {
                if (!(await topLoader.dismiss())) {
                    console.log('Could not dismiss the topmost loader. Aborting...');
                    return;
                }
                topLoader = await this.loadingCtrl.getTop();
            }
        } else {
            this.spinnerDialog.hide();
        }
    }
    async presentAlertForgotPass() {
        const alert = await this.alertsCtrl.create({
            subHeader: this.forgotString,
            inputs: [
                {
                    name: 'email',
                    type: 'email',
                    placeholder: 'camila@lonchis.com.co',
                    value: this.account.username
                },
            ],
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
                        console.log('Confirm Ok', data);
                        this.submitForgot(data);
                    }
                }
            ]
        });
        await alert.present();
    }
    goToGuest() {
        let container = this.dr.pages + "";
        if (container.includes("checkout/shipping")) {
            let arr = container.split("checkout/shipping/");
            this.mapData.hideAll();
            this.mapData.activeType = "Address";
            this.mapData.activeId = "-2";
            this.mapData.merchantId = arr[1];
            this.navCtrl.navigateForward('tabs/map');
        } else {
            this.navCtrl.navigateForward('tabs/guest');
        }

    }
    async performForgotPass(container) {
        let addModal = await this.modalCtrl.create({
            component: ForgotPassPage,
            componentProps: container
        });
        await addModal.present();
        const {data} = await addModal.onDidDismiss();
        if (data) {
            console.log("Process complete, address created", data);
            this.postTokenAuth(data);
        }
    }
    submitForgot(data) {
        this.auth.requestForgotPassword(data).subscribe((resp: any) => {
            console.log("Resp", resp);
            if (resp.status == "success") {
                this.performForgotPass(data);
            } else {
                this.toastCtrl.create({
                    message: this.forgotErrorString,
                    duration: 3000,
                    position: 'top'
                }).then(toast => toast.present());
            }
            console.log("requestForgotPassword result", resp);
        }, (err) => {
            console.log("requestForgotPassword err", err);
            this.toastCtrl.create({
                message: this.forgotErrorString,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
        });
    }
    loginGoogle() {
        if (document.URL.startsWith('http')) {
            console.log("loginGoogle");
        } else {
            this.googlePlus.login({
                'webClientId': '650065312777-h6sq9leehcqo7732m0r8ot3gek1btig9.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
                'offline': true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
            })
                .then(res => {
                    console.log(res);
                    this.verifyToken(res.accessToken, "google");
                })
                .catch(err => console.error(err));
        }

    }
    loginFacebook() {
        if (document.URL.startsWith('http')) {
            console.log("loginFacebook");
        } else {
            this.fb.login(['public_profile', 'email'])
                .then((res: FacebookLoginResponse) => {console.log('Logged into Facebook!', res); this.verifyToken(res.authResponse.accessToken, "facebook");})
                .catch(e => console.log('Error logging into Facebook', e));
        }
    }
    verifyToken(token, platform) {
        let container = {"token": token, "driver": platform};
        this.auth.checkSocialToken(container).subscribe((resp: any) => {
            if (resp.status == "success") {
                this.postTokenAuth(resp.token);
            } else {
                let toast = this.toastCtrl.create({
                    message: this.loginErrorString,
                    duration: 3000,
                    position: 'top'
                }).then(toast => toast.present());
            }
            console.log("checkSocialToken result", resp);
        }, (err) => {
            console.log("checkSocialToken err", err);
            let toast = this.toastCtrl.create({
                message: this.loginErrorString,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
        });
    }
    postTokenAuth(token) {
        this.userData.setToken(token);
        this.user.postLogin().then((value) => {
            this.dismissLoader();
            this.navCtrl.navigateRoot("tabs");
            this.events.publish("authenticated", {});
        }, (err) => {
            this._loadUserData();
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.loginErrorString,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
        });
    }

    viewProduct() {
        let params = {
            "type": "Merchant",
            "objectId": 1303,
            "owner": false
        };
        this.params.setParams(params);
        this.navCtrl.navigateForward("merchant-products");
    }

    ngOnInit() {
    }
    checkLogIn() {
        this.showLoaderEmpty();
        this.userData.getToken().then((value) => {
            console.log("getToken");
            console.log(value);
            if (value) {
                this.postTokenAuth(value);
            } else {
                this._loadUserData();
            }
        });
    }

    // Attempt to login in through our User service
    doLogin() {
        console.log("doLogin");
        this.showLoaderEmpty();
        this.user.login(this.account).subscribe((data) => {
            if (data.access_token) {
                this.user._loggedIn(data, this.account);
            }
            this.user.postLogin().then((value) => {
                this.dismissLoader();
                console.log("Post login complete");
                this.navCtrl.navigateRoot("tabs");
                this.events.publish("authenticated", {});
            }, (err) => {
                console.log("Post login error on registration");
            });
        }, (err) => {
            this.dismissLoader();
            // Unable to log in
            let toast = this.toastCtrl.create({
                message: this.loginErrorString,
                duration: 3000,
                position: 'top'
            }).then(toast => toast.present());
            this.api.handleError(err);
        });
    }
    forgotPass() {
        const browser = this.iab.create("https://dev.lonchis.com.co/password/reset");
        browser.on('exit').subscribe(event => {
        });
    }
    // Attempt to login in through our User service
    _loadUserData() {
        this.dismissLoader();
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
