import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainPassengerPage } from './main-passenger.page';

describe('MainPassengerPage', () => {
  let component: MainPassengerPage;
  let fixture: ComponentFixture<MainPassengerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MainPassengerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
