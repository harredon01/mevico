import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { DocumentDetailPageRoutingModule } from './document-detail-routing.module';

import { DocumentDetailPage } from './document-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    DocumentDetailPageRoutingModule
  ],
  declarations: [DocumentDetailPage]
})
export class DocumentDetailPageModule {}
