import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
@Component({
  selector: 'app-merchant-categories',
  templateUrl: './merchant-categories.page.html',
  styleUrls: ['./merchant-categories.page.scss'],
})
export class MerchantCategoriesPage implements OnInit {
location: string = "n1";
  constructor(public navCtrl: NavController) { }
  
  ngOnInit() {
  }

}
