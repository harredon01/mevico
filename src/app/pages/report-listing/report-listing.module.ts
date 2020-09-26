import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { ReportListingPageRoutingModule } from './report-listing-routing.module';

import { ReportListingPage } from './report-listing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReportListingPageRoutingModule
  ],
  declarations: [ReportListingPage]
})
export class ReportListingPageModule {}
