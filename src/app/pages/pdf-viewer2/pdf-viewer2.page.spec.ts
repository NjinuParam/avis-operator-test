import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfViewer2Page } from './pdf-viewer2.page';

describe('PdfViewer2Page', () => {
  let component: PdfViewer2Page;
  let fixture: ComponentFixture<PdfViewer2Page>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PdfViewer2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
