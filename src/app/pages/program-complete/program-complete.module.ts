import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgramCompletePageRoutingModule } from './program-complete-routing.module';

import { ProgramCompletePage } from './program-complete.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgramCompletePageRoutingModule
  ],
  declarations: [ProgramCompletePage]
})
export class ProgramCompletePageModule {}
