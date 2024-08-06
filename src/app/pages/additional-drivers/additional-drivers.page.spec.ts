import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AdditionalDriversPage } from './additional-drivers.page';

describe('AdditionalDriversPage', () => {
  let component: AdditionalDriversPage;
  let fixture: ComponentFixture<AdditionalDriversPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdditionalDriversPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
