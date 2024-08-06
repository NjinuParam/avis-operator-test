import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  addBooking,
  addToInprogressBookings,
  clearInprogressBookings,
} from 'src/app/store/bookings/bookings.actions';
import { BottomMenuPage } from '../../shared/bottom-menu/bottom-menu.page';
import { BookingService } from 'src/app/services/booking.service';
import { IBookingType } from 'src/app/interfaces/bookingType.interface';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.html',
  styleUrls: ['./booking-summary.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BottomMenuPage],
})
export class BookingSummaryPage implements OnInit {
  bookingNumber = '';
  editable: boolean = false;
  booking: any;
  bookingTypes: IBookingType[] = [];
  loading = true;
  user: any;
  constructor(
    private router: Router,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private bookingService: BookingService,
    private cookieService: CookieService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.bookingNumber = params['bookingNumber'];
  
      this.bookingService.currentQuoteId = this.bookingNumber;
      this.getBooking();
    });

    this.activatedRoute.queryParams
    .subscribe(params => {
      console.log(params); // { orderby: "price" }
      this.editable = params['editable']=="true";

    }
  );

    this.store
      .select((store: any) => store.bookingTypes.bookingTypes)
      .subscribe((res) => {
        console.log('SESSSS', res);
        this.bookingTypes = res;
      });
    this.user = JSON.parse(atob(this.cookieService.get('avis-user')));
  }

  getBooking() {
    this.bookingService.getBookingsByBookingId(this.bookingNumber).subscribe(
      (response) => {
        this.loading = false;
        this.booking = response;
      },
      (error) => (this.loading = false)
    );
  }

  ngOnInit() {}
  back() {
    this.store.dispatch(clearInprogressBookings());
    this.router.navigateByUrl('/bookings');
  }
  track(index:number) {
    this.router.navigateByUrl(
      `/vehicle-track?bookingNumber=${this.bookingNumber}&bookingLeg=${index}`
    );
  }
  edit(index: number) {
    const mapped = this.mapLegToBooking(this.booking);
    (this.bookingService.currentQuoteId =
      this.booking.getBookingResult.quoteNumber),
      (this.bookingService.currentBookingId =
        this.booking.getBookingResult.bookingNumber);

    this.store.dispatch(addBooking({ booking: mapped[index] }));
    this.store.dispatch(clearInprogressBookings());

    // const test = this.bookingService.populateBookingData(mapped);

    mapped.forEach((leg: any, i: number) => {
      if (index !== i) {
        this.store.dispatch(addToInprogressBookings({ booking: leg }));
      }
    });

    this.router.navigateByUrl('/available-booking-types/edit');
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
    var mapped = response.getBookingResult.legs.leg.map((x: any) => {
      return {
        ...x,
        collectionAddress: {
          ...x.collectionAddress,
          airportFlightNumber: x.collectionAddress?.flightNumber,
        },
        destinationAddress: {
          ...x.destinationAddress,
          airportFlightNumber: x.destinationAddress?.flightNumber,
        },
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
        pickUp: `${x.collectionAddress.name} ${x.collectionAddress.suburb} ${x.collectionAddress.town}`,
        pickUpDate: x.collectionDateTime,
        dropOffDate: x.destinationDateTime,
        passengers: x.passengerDetails?.passengers?.map((p: any) => {
          return {
            name: p.name,
            surname: p.surname,
            title: p.title,
            contact: `${p.mobileNumber?.internationalDialingCode}${p.mobileNumber?.number}`,
          };
        }),
        pickupflightno: x.collectionAddress?.flightNumber,
        dropoffflightno: x.destinationAddress?.flightNumber,
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
  getBookingType(rateTypeDescription: string) {
    if (rateTypeDescription.includes('ALC')) {
      return 'Luxury Car Rental';
    } else if (rateTypeDescription.includes('ACD')) {
      return 'Point to point';
    } else {
      return 'Chauffeur Drive';
    }
    return '';
  }
  getExtraTotal(extra: any) {
    const res = parseFloat(extra.amount) * parseFloat(extra.quantity);
    return res;
  }
}
