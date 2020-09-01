import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentListingPage } from './document-listing.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentListingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentListingPageRoutingModule {}
