import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';
import { Store } from '@ngrx/store';
import {
  addBooking,
  addToInprogressBookings,
  clearInprogressBookings,
} from 'src/app/store/bookings/bookings.actions';
import { IBookingType } from 'src/app/interfaces/bookingType.interface';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-quote-summary',
  templateUrl: './quote-summary.page.html',
  styleUrls: ['./quote-summary.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class QuoteSummaryPage implements OnInit {
  quoteNumber = '';
  quote: any;
  booking: any;
  user: any;
  loading = true;
  bookingTypes: IBookingType[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router,
    private store: Store,
    private cookieService: CookieService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.quoteNumber = params['quoteNumber'];
      this.bookingService.currentQuoteId = this.quoteNumber;
      console.log('getting quote');
      this.bookingService.getQuote(this.quoteNumber).subscribe(
        (response) => {
          console.log(response);
          this.loading = false;
          this.quote = response;
        },
        (error) => (this.loading = false)
      );
    });
    this.store
      .select((store: any) => store.bookingTypes.bookingTypes)
      .subscribe((res) => {
        console.log('SESSSS', res);
        this.bookingTypes = res;
      });
    this.store
      .select((store: any) => store.bookings)
      .subscribe((res) => {
        this.booking = res.selectedBooking;
      });
    this.user = JSON.parse(atob(this.cookieService.get('avis-user')));
  }

  ngOnInit() {}
  back(){
    this.store.dispatch(clearInprogressBookings());
    this.router.navigateByUrl('/bookings');
  }
  confirmBooking() {
    const mapped = this.mapLegToBooking(this.quote);
    (this.bookingService.currentQuoteId =
      this.quote.getQuoteResult.quoteNumber),
      this.store.dispatch(clearInprogressBookings());
    mapped.forEach((leg: any) => {
      this.store.dispatch(addToInprogressBookings({ booking: leg }));
    });
    this.router.navigateByUrl('/conditions');
  }
  editBooking(index: number) {
    const mapped = this.mapLegToBooking(this.quote);
    (this.bookingService.currentQuoteId =
      this.quote.getQuoteResult.quoteNumber),
      this.store.dispatch(addBooking({ booking: mapped[index] }));
    this.store.dispatch(clearInprogressBookings());

    // const bookingLegs = [...mapped];
    // const data: any = {
    //   bookingLegs: bookingLegs,
    // };
    // const test = this.bookingService.populateBookingData(data);
    mapped.forEach((leg: any, i: number) => {
      if (index !== i) {
        this.store.dispatch(addToInprogressBookings({ booking: leg }));
      }
    });

    this.router.navigateByUrl('/available-booking-types/edit');
  }
  getBookingType(rateTypeDescription: string) {
    if (rateTypeDescription.includes('ALC')) {
      return 'Luxury Car Rental';
    } else if (rateTypeDescription.includes('ACD')) {
      return 'Point to point';
    } else {
      return 'Chauffeur Drive';
    }
  }
  getDailyRate(leg: any) {
    const date1 = new Date(leg.collectionDateTime);
    const date2 = new Date(leg.destinationDateTime);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const rate = leg?.totalRateAmount / diffDays;
    return rate;
  }
  mapLegToBooking(response: any) {
    var mapped = response.getQuoteResult.legs.leg.map((x: any) => {
      return {
        ...x,
        bookingType: this.bookingTypes.find(
          (b) => b.avisCode == x.serviceTypeDescription
        ),
        IsAirportPickUp:
          x.collectionAddress.locationType == 'AIRPORT' ? true : false,
        pickUpAirport:
          x.collectionAddress.locationType == 'AIRPORT'
            ? x.collectionAddress.name
            : false,
        IsAirportDropOff:
          x.destinationAddress.locationType == 'AIRPORT' ? true : false,
        dropOffAirport:
          x.destinationAddress.locationType == 'AIRPORT'
            ? x.destinationAddress.name
            : false,
        dropOff: `${x.destinationAddress.name} ${x.destinationAddress.suburb} ${x.destinationAddress.town}`,
        customer: response.customer,
        rateNumber: this.user.customerId,
        vehicle: {
          description: x.vehicleTypeDescription,
          doors: '',
          fuelType: '',
          code: x.vehicleCode,
          bookingType: {
            name: x.serviceTypeDescription,
            id:
                x.serviceTypeDescription == 'CHAUFFEUR DRIVE DISPOSAL'
                ? 3
                : x.serviceTypeDescription == 'AVIS LUXURY CARS'
                ? 1
                : 2,
          },
          image: x.vehicleImage,
        },
        pickUpDate: x.collectionDateTime,
        dropOffDate: x.destinationDateTime,
        pickUp: `${x.collectionAddress.name} ${x.collectionAddress.suburb} ${x.collectionAddress.town}`,
        passengers: x.passengerDetails.passengers,

        selectedAccessories: x.equipment.equipment.map((y: any) => {
          return {
            qty: y.quantity,
            option: y.description,
            cost: y.amount,
            code: y.code,
          };
        }),
        feeBreakdown: {
          fee: [],
        },
      };
    });
    return mapped;
  }
  getExtraTotal(extra: any) {
    const res = parseFloat(extra.amount) * parseFloat(extra.quantity);
    return res;
  }
}
