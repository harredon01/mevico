import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AvailabilityCreatePage } from './availability-create.page';

const routes: Routes = [
  {
    path: '',
    component: AvailabilityCreatePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AvailabilityCreatePage]
})
export class AvailabilityCreatePageModule {}
