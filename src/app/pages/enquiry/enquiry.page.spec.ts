import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnquiryPage } from './enquiry.page';

describe('EnquiryPage', () => {
  let component: EnquiryPage;
  let fixture: ComponentFixture<EnquiryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EnquiryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
