import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BookingService } from 'src/app/services/booking.service';
import { ToastService } from 'src/app/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pdf-viewer2',
  templateUrl: './pdf-viewer2.page.html',
  styleUrls: ['./pdf-viewer2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, PdfViewerModule],
})
export class PdfViewer2Page implements OnInit {
bookingId="";
  pdfSrc = '';
  constructor(
    private bookingService: BookingService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    
    this.route.queryParams.subscribe((params:any) => {
      if (params) {
        this.bookingId = params.bookingId;
        bookingService.getInvoice(params.bookingId,params.stage).subscribe((_doc: any) => {
        // bookingService.getInvoice("3238354","1").subscribe((_doc: any) => {
          
          if(_doc=="No RA Number found"){
       
          
         
            this.toast.showToast(`No invoice found for selected booking.`);
            setTimeout(() => this.router.navigateByUrl('/bookings'),2500);
            
          }else{
            const doc = JSON.parse(_doc);
            var base64String = doc.getDocOutput.result.document.documentContent;
            this.setBase64(base64String);
          }
        
        })
      }
    });
   
  }

  back(){

    
    this.router.navigateByUrl('/bookings');
  }


  setBase64(base64String: string) {
   
    this.pdfSrc  =`data:application/pdf;base64,${base64String}`;
  }


  ngOnInit() {}
}
