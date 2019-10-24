import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MercadoPagoOptionsPage } from './mercado-pago-options.page';

const routes: Routes = [
  {
    path: '',
    component: MercadoPagoOptionsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MercadoPagoOptionsPage]
})
export class MercadoPagoOptionsPageModule {}
