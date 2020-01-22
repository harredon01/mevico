import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MercadoPagoCashPage } from './mercado-pago-cash.page';

const routes: Routes = [
  {
    path: '',
    component: MercadoPagoCashPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MercadoPagoCashPage]
})
export class MercadoPagoCashPageModule {}
