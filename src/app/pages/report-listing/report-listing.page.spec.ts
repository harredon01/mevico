import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReportListingPage } from './report-listing.page';

describe('ReportListingPage', () => {
  let component: ReportListingPage;
  let fixture: ComponentFixture<ReportListingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportListingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
