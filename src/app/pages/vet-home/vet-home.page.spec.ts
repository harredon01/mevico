import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VetHomePage } from './vet-home.page';

describe('VetHomePage', () => {
  let component: VetHomePage;
  let fixture: ComponentFixture<VetHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VetHomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VetHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
