import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewMerchantPage } from './new-merchant.page';

const routes: Routes = [
  {
    path: '',
    component: NewMerchantPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NewMerchantPage]
})
export class NewMerchantPageModule {}
