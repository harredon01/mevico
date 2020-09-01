import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DocumentListingPageRoutingModule } from './document-listing-routing.module';

import { DocumentListingPage } from './document-listing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocumentListingPageRoutingModule
  ],
  declarations: [DocumentListingPage]
})
export class DocumentListingPageModule {}
