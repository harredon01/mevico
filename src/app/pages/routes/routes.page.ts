import { Component, OnInit } from '@angular/core';
import {Route} from '../../models/route';
import {TranslateService} from '@ngx-translate/core';
import {NavController, ModalController, ToastController, LoadingController} from '@ionic/angular';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {RoutingService} from '../../services/routing/routing.service';
import {ParamsService} from '../../services/params/params.service';
@Component({
  selector: 'app-routes',
  templateUrl: './routes.page.html',
  styleUrls: ['./routes.page.scss'],
})
export class RoutesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
