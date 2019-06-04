import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavController} from '@ionic/angular';

import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(public navCtrl: NavController,
        public user: UserService,
        public translate: TranslateService) {
    }
ngOnInit() {
  }
    openItem(item: any) {
        this.navCtrl.navigateForward(item);
    }
    logout() {
        this.user.logout();
    }

  

}
