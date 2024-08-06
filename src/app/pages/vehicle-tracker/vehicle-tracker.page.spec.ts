import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleTrackerPage } from './vehicle-tracker.page';

describe('VehicleTrackerPage', () => {
  let component: VehicleTrackerPage;
  let fixture: ComponentFixture<VehicleTrackerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VehicleTrackerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
