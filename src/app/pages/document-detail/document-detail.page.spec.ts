import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DocumentDetailPage } from './document-detail.page';

describe('DocumentDetailPage', () => {
  let component: DocumentDetailPage;
  let fixture: ComponentFixture<DocumentDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
