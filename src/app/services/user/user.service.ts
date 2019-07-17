import {Injectable} from '@angular/core';
import {ApiService} from '../api/api.service';
import {UserDataService} from '../user-data/user-data.service';
import {OneSignal} from '@ionic-native/onesignal/ngx';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    _user: any;

    constructor(public api: ApiService,
        public userData: UserDataService,
        private oneSignal: OneSignal) {

    }
    /**
     * Send a POST request to our login endpoint with the data
     * the user entered on the form.
     */
    login(accountInfo: any) {
        accountInfo.client_id = 1;
        accountInfo.client_secret = "nuoLagU2jqmzWqN6zHMEo82vNhiFpbsBsqcs2DPt";
        accountInfo.grant_type = "password";
        accountInfo.scope = "*";
        let seq = this.api.post('/oauth/token', accountInfo);

        seq.subscribe((data: any) => {

            console.log("after auth");
            console.log(JSON.stringify(data));
            // If the API returned a successful response, mark the user as logged in
            if (data.access_token) {
                this._loggedIn(data, accountInfo);
            } else {
            }
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });

        return seq;
    }
    postLogin() {
        return new Promise((resolve, reject) => {
            this.getUser().subscribe((resp: any) => {
                if (resp) {
                    console.log("getUser", resp);
                    this.userData._user = resp.user;
                    let savedCards = resp.savedCards;
                    for (let key in savedCards) {
                        if (savedCards[key] == "PayU") {
                            this.userData._user.savedCard = true;
                        }
                    }
                    console.log("getUser", this.userData._user);
                    resolve("User fetched");
                }
                this.saveTokenServer();
            }, (err) => {
                console.log("getTokenError", err);
                this.userData.deleteToken();
                reject("get user error")
                // Unable to log in
            });
        });
    }
    saveTokenServer() {
        this.oneSignal.getIds().then((ids) => {
            console.log('platform: food  getIds: ' + JSON.stringify(ids));
            let token = {
                "platform": "food",
                "token": ids.userId
            }
            this.registerToken(token);
        });
    }
    /**
     * Send a POST request to our login endpoint with the data
     * the user entered on the form.
     */
    getUser() {

        let seq = this.api.get('/user');

        seq.subscribe((data: any) => {

            console.log("after get user");
            console.log(JSON.stringify(data));
            return data;
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });

        return seq;
    }

    /**
     * Send a POST request to our login endpoint with the data
     * the user entered on the form.
     */
    checkCredits(credits: any) {

        let seq = this.api.post('/user/credits', credits);

        seq.subscribe((data: any) => {

            console.log("after checkcredits");
            console.log(JSON.stringify(data));
            return data;
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });

        return seq;
    }
    /**
     * Send a POST request to our login endpoint with the data
     * the user entered on the form.
     */
    setAddressType(address: any, typeAddres: any) {
        let cont = {};
        let seq = this.api.post('/user/address/' + address + "/" + typeAddres, cont);

        seq.subscribe((data: any) => {

            console.log("after checkcredits");
            console.log(JSON.stringify(data));
            return data;
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });

        return seq;
    }

    /**
     * Send a POST request to our login endpoint with the data
     * the user entered on the form.
     */
    getUserByEmail(email: any) {
        let seq = this.api.get('/contact/email/' + email);
        seq.subscribe((data: any) => {
            console.log("after getUserByEmail");
            console.log(JSON.stringify(data));
            return data;
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }

    
    /**
         * Send a POST request to our signup endpoint with the data
         * the user entered on the form.
         */
    registerToken(token: any) {
        let seq = this.api.post('/user/token', token);

        seq.subscribe((res: any) => {
            // If the API returned a successful response, mark the user as logged in
            if (res.status == 'success') {
                console.log("Push notifications token successfully stored");
            }
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });

        return seq;
    }
    /**
     * Send a POST request to our signup endpoint with the data
     * the user entered on the form.
     */
    signup(accountInfo: any) {
        console.log("Signup");
        console.log(JSON.stringify(accountInfo));
        let seq = this.api.post('/auth/register', accountInfo);
        console.log("seq");
        console.log(JSON.stringify(seq));
        seq.subscribe((res: any) => {
            console.log("after signup");
            console.log(JSON.stringify(res));
            
            // If the API returned a successful response, mark the user as logged in
            if (res.status == 'success') {
                accountInfo.remember = true;
                this._loggedIn(res, accountInfo);
            }
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });

        return seq;
    }
    /**
     * Send a POST request to our signup endpoint with the data
     * the user entered on the form.
     */
    myAccount(accountInfo: any) {
        let seq = this.api.post('/user', accountInfo);

        seq.subscribe((res: any) => {
            // If the API returned a successful response, mark the user as logged in
            return res;
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });

        return seq;
    }

    /**
     * Log the user out, which forgets the session
     */
    logout() {
        
        let seq = this.api.get('/auth/logout');
        seq.subscribe((res: any) => {
            let container = {"status": 401};
            this.userData.logout();
            this.api.handleError(container);
            // If the API returned a successful response, mark the user as logged in
        }, err => {
            console.error('ERROR', err);
            this.api.handleError(err);
        });
        return seq;
    }

    /**
       * Process a login/signup response to store user data
       */
    _loggedIn(resp, accountInfo) {
        this._user = resp.user;
        console.log("accountInfo.remember", accountInfo.remember);
        console.log("token", resp.access_token);
        this.userData.setToken(resp.access_token);
        if (accountInfo.remember) {

            this.userData.setUsername(accountInfo.username);
            this.userData.setPassword(accountInfo.password);
            this.userData.setRemember(accountInfo.remember);
        }
        this.saveTokenServer();

    }
}
