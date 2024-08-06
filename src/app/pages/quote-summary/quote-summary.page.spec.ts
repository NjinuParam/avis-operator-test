import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuoteSummaryPage } from './quote-summary.page';

describe('QuoteSummaryPage', () => {
  let component: QuoteSummaryPage;
  let fixture: ComponentFixture<QuoteSummaryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuoteSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
