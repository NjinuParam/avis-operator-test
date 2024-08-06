import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { NgOtpInputModule } from  'ng-otp-input';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgOtpInputModule,
    PdfViewerModule
  ],
  providers: [],

})
export class AppModule { }
