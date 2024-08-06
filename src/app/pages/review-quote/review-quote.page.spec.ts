import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewQuotePage } from './review-quote.page';

describe('ReviewQuotePage', () => {
  let component: ReviewQuotePage;
  let fixture: ComponentFixture<ReviewQuotePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReviewQuotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
