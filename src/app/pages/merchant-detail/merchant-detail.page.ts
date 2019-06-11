import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
@Component({
  selector: 'app-merchant-detail',
  templateUrl: './merchant-detail.page.html',
  styleUrls: ['./merchant-detail.page.scss'],
})
export class MerchantDetailPage implements OnInit {
doctor: string = "about";
Short: string = "n1"; 

  constructor(public navCtrl: NavController) {
  
  }
  
   addfeedback(){
    //this.navCtrl.push(AddfeedbackPage);
    }
     appointmentbook(){
    //this.navCtrl.push(AppointmentbookPage);
    }

  ngOnInit() {
  }

}
