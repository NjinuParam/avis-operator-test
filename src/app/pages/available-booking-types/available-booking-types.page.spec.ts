import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvailableBookingTypesPage } from './available-booking-types.page';

describe('AvailableBookingTypesPage', () => {
  let component: AvailableBookingTypesPage;
  let fixture: ComponentFixture<AvailableBookingTypesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AvailableBookingTypesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
