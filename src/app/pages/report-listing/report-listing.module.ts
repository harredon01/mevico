import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportListingPageRoutingModule } from './report-listing-routing.module';

import { ReportListingPage } from './report-listing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportListingPageRoutingModule
  ],
  declarations: [ReportListingPage]
})
export class ReportListingPageModule {}
