import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { NewReportPageRoutingModule } from './new-report-routing.module';

import { NewReportPage } from './new-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    IonicModule,
    NewReportPageRoutingModule
  ],
  declarations: [NewReportPage]
})
export class NewReportPageModule {}
