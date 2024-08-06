import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BottomMenuPage } from '../../shared/bottom-menu/bottom-menu.page';
import { BookingService } from 'src/app/services/booking.service';
import { Store } from '@ngrx/store';
import {
  IDocument,
  IDocumentUpload,
} from 'src/app/interfaces/booking.interface';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.page.html',
  styleUrls: ['./conditions.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BottomMenuPage],
})
export class ConditionsPage implements OnInit {
  currentBooking: any[] = [];
  loggedInUser: any;
  customerData: any;
  documents: any[] = [];
  uploadImages: Boolean = false;
  termsAccepted: boolean = false;
  cleanTerms: any;
  allTerms: any;
  constructor(
    private store: Store,
    private bookingService: BookingService,
    private cookieService: CookieService,
    private router: Router,
    private userService: AuthService
  ) {
    this.store
      .select((store: any) => store.bookings.inProgressBookings)
      .subscribe((booking: any) => {
        console.log('Bookinghere', booking);
        this.currentBooking = booking;
      });

    //get customer details
    // var user =  JSON.parse(this.cookieService.get('avis-user'));
    // this.userService.getCustomer(user.id).subscribe((x:any)=>{
    //   this.customerData = x;

    // })
  }
  termsAccpeted(event: any) {
    this.termsAccepted = event.detail.checked;
  }
  ionViewDidEnter() {
    var user = JSON.parse(atob(this.cookieService.get('avis-user')));
    this.loggedInUser = user;
// 
    this.bookingService
      .getQuoteTerms(this.bookingService.currentQuoteId)
      .subscribe((_terms) => {
        const t = _terms as any;
        const clean = t.results.map((x: any) => x.termDetail.trim());
        this.cleanTerms = clean;
        this.allTerms = clean.join('<br/>');
      });
  }

  ngOnInit(): void {
    
    
  }
  back(){
    this.router.navigateByUrl('/bookings');
  }
  finish() {
    const booking = [...this.currentBooking];
    this.router.navigateByUrl('/credit-card');
    
  }
}
