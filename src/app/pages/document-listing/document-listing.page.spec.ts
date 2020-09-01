import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DocumentListingPage } from './document-listing.page';

describe('DocumentListingPage', () => {
  let component: DocumentListingPage;
  let fixture: ComponentFixture<DocumentListingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentListingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
