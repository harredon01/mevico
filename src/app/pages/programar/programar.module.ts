import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgramarPageRoutingModule } from './programar-routing.module';

import { ProgramarPage } from './programar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgramarPageRoutingModule
  ],
  declarations: [ProgramarPage]
})
export class ProgramarPageModule {}
