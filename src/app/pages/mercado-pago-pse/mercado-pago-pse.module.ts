import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MercadoPagoPsePage } from './mercado-pago-pse.page';

const routes: Routes = [
  {
    path: '',
    component: MercadoPagoPsePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MercadoPagoPsePage]
})
export class MercadoPagoPsePageModule {}
