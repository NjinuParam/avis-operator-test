import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WizardNumberPage } from './wizard-number.page';

describe('WizardNumberPage', () => {
  let component: WizardNumberPage;
  let fixture: ComponentFixture<WizardNumberPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WizardNumberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
