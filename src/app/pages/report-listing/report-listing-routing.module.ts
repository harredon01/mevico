import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportListingPage } from './report-listing.page';

const routes: Routes = [
  {
    path: '',
    component: ReportListingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportListingPageRoutingModule {}
