import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.page.html',
  styleUrls: ['./enquiry.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class EnquiryPage implements OnInit {
  form = this.fb.group({
    returnCode: [''],
    guid: [''],
    bookingChannel: ['H'],
    stageNumber: ['', Validators.required],
    bookingNumber: ['', Validators.required],
    complainantName: ['', Validators.required],
    complainantSurname: ['', Validators.required],
    complainantMobile: ['', Validators.required],
    complainantCompany: [''],
    complainantEmail: [''],
    complaint: ['', Validators.required],
  });
  enquiryType = '';
  legs: any = [];
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private bookingService: BookingService,
    private toast: ToastService,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.form.value.bookingNumber = params['bookingNumber'];
      this.getBooking(params['bookingNumber'], params['leg']);
    });
  }
  getBooking(bookingNumber: string, leg: string) {
    this.bookingService
      .getBookingsByBookingId(bookingNumber)
      .subscribe((response: any) => {
        this.form.controls['bookingNumber'].setValue(bookingNumber);
        this.form.controls['complainantName'].setValue(
          response.customer.customerFullNames
        );
        this.form.controls['complainantSurname'].setValue(
          response.customer.customerSurname
        );
        this.form.controls['complainantMobile'].setValue(
          response.customer.cellNumber
        );
        this.form.controls['complainantEmail'].setValue(
          response.customer.email
        );
        this.legs = response.getBookingResult.legs.leg.map(
          (l: any) => l.legNumber
        );
      });

    // this.bookingService
    //   .getBookingEnquiry(bookingNumber, '1')
    //   .subscribe((response) => console.log(response));
  }

  back(){
    this.router.navigateByUrl('/bookings');
  }

  ngOnInit() {}

  logEnquiry() {
    if (this.form.valid) {
      this.bookingService
        .logEnquiry(this.form.value)
        .subscribe((response: any) => {
          console.log(response);
          this.toast.showToast('Thank you for logging an enquiry. The Avis Luxury Car and Chauffeur Drive team will revert back with feedback within 1 business day.  ');
          this.router.navigate(['bookings']);
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
