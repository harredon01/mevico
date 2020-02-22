import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import {NavController, ToastController, LoadingController, Events} from '@ionic/angular';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {UserService} from '../../services/user/user.service';
import {UserDataService} from '../../services/user-data/user-data.service';
import {AuthService} from '../../services/auth/auth.service';
import {ApiService} from '../../services/api/api.service';

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
    // Our translated text strings
    private updateErrorString: string;
    private updateStartString: string;
    private isUpdating: boolean;
    constructor(public spinnerDialog: SpinnerDialog,
        public navCtrl: NavController,
        private googlePlus: GooglePlus,
        private fb: Facebook,
        public user: UserService,
        public api: ApiService,
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
    dismissLoader() {
        if (document.URL.startsWith('http')) {
            this.loadingCtrl.dismiss();
        } else {
            this.spinnerDialog.hide();
        }
    }
    loginGoogle() {
        this.googlePlus.login({
            'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
            'webClientId': '650065312777-h6sq9leehcqo7732m0r8ot3gek1btig9.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
            'offline': true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
        })
            .then(res => {
                console.log(res);
                this.verifyToken(res.accessToken, "google");
            })
            .catch(err => console.error(err));
    }
    loginFacebook() {
        this.fb.login(['public_profile', 'user_friends', 'email'])
            .then((res: FacebookLoginResponse) => {console.log('Logged into Facebook!', res); this.verifyToken(res.authResponse.accessToken, "facebook");})
            .catch(e => console.log('Error logging into Facebook', e));
    }
    verifyToken(token, platform) {
        let container = {"token": token, "driver": platform};
        this.auth.checkSocialToken(container).subscribe((resp: any) => {
            if (resp.status == "success") {
                this.userData.setToken(resp.token);
                this.user.postLogin().then((value) => {
                    this.dismissLoader();
                    this.navCtrl.navigateRoot("tabs");
                    this.events.publish("authenticated");
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
                    this.dismissLoader();
                    this.navCtrl.navigateRoot("tabs");
                    this.events.publish("authenticated");
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
        this.user.login(this.account).subscribe((data) => {
            if (data.access_token) {
                this.user._loggedIn(data, this.account);
            }
            this.user.postLogin().then((value) => {
                this.dismissLoader();
                console.log("Post login complete");
                this.navCtrl.navigateRoot("tabs");
                this.events.publish("authenticated");
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
