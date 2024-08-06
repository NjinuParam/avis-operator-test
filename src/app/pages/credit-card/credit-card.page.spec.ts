import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreditCardPage } from './credit-card.page';

describe('CreditCardPage', () => {
  let component: CreditCardPage;
  let fixture: ComponentFixture<CreditCardPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreditCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
