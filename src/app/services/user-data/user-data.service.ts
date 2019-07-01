import {HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {
    _user: any;
    _headers: any;

   constructor(public storage: Storage) {
        console.log("Building headers");
        this._headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'my-auth-token',
            'Accept': 'application/json'
        });
    }
    getLanguage(): Promise<string> {
        return this.storage.get('language').then((value) => {
            return value;
        });
    }
    setLanguage(lang) {
        this.storage.set('language', lang);
    }

    /**
     * Send a POST request to our login endpoint with the data
     * the user entered on the form.
     */
    setToken(token: any) {
        this._headers = this._headers.set('Authorization', 'Bearer ' + token);
        this._headers = this._headers.set('X-Auth-Token', token);
        this.storage.set('token', token);
        //    let seq = this.api.post('login', accountInfo).share();
        //
        //    seq.subscribe((res: any) => {
        //      // If the API returned a successful response, mark the user as logged in
        //      if (res.status == 'success') {
        //        this._loggedIn(res);
        //      } else {
        //      }
        //    }, err => {
        //      console.error('ERROR', err);
        //    });
        //
        //    return seq;
    }

    /**
     * get username from local storage.
     */
    getToken(): Promise<string> {
        return this.storage.get('token').then((value) => {
            return value;
        });
    }
    deleteToken(): Promise<string> {
        return this.storage.remove('token').then((value) => {
            return value;
        });
    }
    deleteAllSession(): Promise<string> {
        return this.storage.remove('token').then((value) => {
            this.storage.remove('username');
            this.storage.remove('password');
            this.storage.remove('remember');

            this._headers = this._headers.set('Authorization', 'Bearer ');
            this._headers = this._headers.set('X-Auth-Token', '');
            this.storage.set('token', null);
            return value;
        });
    }

    /**
     * Saves username in local storage.
     */
    setUsername(username: string): Promise<any> {
        return this.storage.set('username', username);
    }

    /**
   * get username from local storage.
   */
    getUsername(): Promise<string> {
        return this.storage.get('username').then((value) => {
            return value;
        });
    }

    /**
     * Saves username in local storage.
     */
    setQuickPay(username: string): Promise<any> {
        return this.storage.set('username', username);
    }

    /**
   * get username from local storage.
   */
    getQuickPay(): Promise<string> {
        return this.storage.get('username').then((value) => {
            return value;
        });
    }
    /**
     * Saves username in local storage.
     */
    setPassword(password: string): Promise<any> {
        return this.storage.set('password', password);
    }

    /**
   * get username from local storage.
   */
    getPassword(): Promise<string> {
        return this.storage.get('password').then((value) => {
            return value;
        });
    }
    /**
     * Saves username in local storage.
     */
    setRemember(remember: boolean): Promise<any> {
        return this.storage.set('remember', remember);
    }

    /**
   * get username from local storage.
   */
    getRemember(): Promise<string> {
        return this.storage.get('remember').then((value) => {
            return value;
        });
    }

    /**
     * Send a POST request to our signup endpoint with the data
     * the user entered on the form.
     */
    signup(accountInfo: any) {
        //    let seq = this.api.post('signup', accountInfo).share();
        //
        //    seq.subscribe((res: any) => {
        //      // If the API returned a successful response, mark the user as logged in
        //      if (res.status == 'success') {
        //        this._loggedIn(res);
        //      }
        //    }, err => {
        //      console.error('ERROR', err);
        //    });
        //
        //    return seq;
    }

    /**
     * Log the user out, which forgets the session
     */
    logout() {
        this._user = null;
        this.storage.remove('token');

        this._headers = this._headers.set('Authorization', 'Bearer ');
        this._headers = this._headers.set('X-Auth-Token', '');
        this.storage.set('token', null);
    }

    /**
     * Process a login/signup response to store user data
     */
    _loggedIn(resp) {
        this._user = resp.user;
    }
}
