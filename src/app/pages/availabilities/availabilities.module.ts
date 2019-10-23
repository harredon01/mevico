import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AvailabilitiesPage } from './availabilities.page';

const routes: Routes = [
  {
    path: '',
    component: AvailabilitiesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AvailabilitiesPage]
})
export class AvailabilitiesPageModule {}
