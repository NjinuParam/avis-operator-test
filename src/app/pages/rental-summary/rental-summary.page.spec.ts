import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RentalSummary } from './rental-summary.page';

describe('ReviewQuotePage', () => {
  let component: RentalSummary;
  let fixture: ComponentFixture<RentalSummary>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RentalSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
