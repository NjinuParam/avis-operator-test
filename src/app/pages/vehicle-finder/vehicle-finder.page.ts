import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BookingService } from 'src/app/services/booking.service';
import { AddressAutocompleteComponent } from 'src/app/shared/address-autocomplete/address-autocomplete.component';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { addBooking } from 'src/app/store/bookings/bookings.actions';
import { DatePipe } from '@angular/common';
import { loadVehicles } from 'src/app/store/vehicles/vehicles.actions';
import { BottomMenuPage } from 'src/app/shared/bottom-menu/bottom-menu.page';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Customerservice } from 'src/app/services/customer.service';
@Component({
  selector: 'app-vehicle-finder',
  templateUrl: './vehicle-finder.page.html',
  styleUrls: ['./vehicle-finder.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AddressAutocompleteComponent,
    BottomMenuPage,
  ],
  providers: [DatePipe],
})
export class VehicleFinderPage implements OnInit, OnDestroy {
  isAirportPickUp = false;
  isAirportDropOff = false;
  pickUpAirports: any[] = [];
  dropOffAirports: any[] = [];
  vehicleFinderForm: FormGroup;
  highlightedDates: any[] = [];
  dropOffName: string = '';
  dropOffLatitude: number = 0;
  dropOffLongitude: number = 0;
  dropOffStreetNumber: string = '';
  googleDropOff = '';
  googlePickUp = '';
  pickupName: string = '';
  pickupLatitude: number = 0;
  pickupLongitude: number = 0;
  pickupStreetNumber: string = '';
  pickupTown: string = '';
  pickupSuburb: string = '';
  dropOffTown: string = '';
  dropOffSuburb: string = '';
  startMinDate = new Date().toISOString();
  maxStartDate = new Date(
    new Date().setFullYear(new Date().getFullYear() + 1)
  ).toISOString();
  endMinDate = new Date().toISOString();
  maxEndDate = new Date(
    new Date().setFullYear(new Date().getFullYear() + 1)
  ).toISOString();

  pickUpDate: Date = new Date();
  dropOffDate: Date = new Date();
  now: string | null;
  minDate: string | null;
  maxDate: string | null;
  booking!: any;
  subscriptions: Subscription[] = [];
  wizardNumber: string = '';
  user: any;
  dropOffstreetBuildingName: string = '';
  pickstreetBuildingName: string = '';
  dropOffLatLng: { lat: number; lng: number } | undefined;
  frequentlyUsedAddresses = [];
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private bookingService: BookingService,
    private store: Store,
    private datePipe: DatePipe,
    private cookieService: CookieService,
    private customerService: Customerservice
  ) {
    this.getAirports();
    const now = new Date();
    this.now = this.datePipe.transform(now, 'yyyy-MM-ddTHH:mm:ss');
    this.minDate = this.datePipe.transform(now, 'yyyy-MM-ddTHH:mm:ss');
    this.maxDate = this.datePipe.transform(
      now.setDate(now.getDate() + 30),
      'yyyy-MM-ddTHH:mm:ss'
    );


        
    this.vehicleFinderForm = this.fb.group({
      pickUpDate: [new Date(), [Validators.required]],
      dropOffDate: [new Date(), [Validators.required]],
      pickUpAirport: ['', [Validators.required]],
      dropOffAirport: ['', [Validators.required]],
      pickupflightno: [''],
      dropoffflightno: [''],
    });
    const sub = this.store
      .select((store: any) => store.bookings.selectedBooking)
      .subscribe((res) => {
        
        this.booking = res;
        if (this.booking) {
          this.isAirportDropOff = this.booking.IsAirportDropOff ?? false;
          this.isAirportPickUp = this.booking.IsAirportPickUp ?? false;
          
          if (this.isAirportPickUp) {
          debugger;
            this.vehicleFinderForm.controls['pickupflightno'].setValue(
              this.booking.collectionAddress?.flightNumber??""
            );
            this.vehicleFinderForm.controls['pickUpAirport'].setValue(
              this.booking.pickUpAirport
            );
          } else {
            if (this.booking.pickUp) {
              debugger;
              this.googlePickUp = this.booking.pickUp;

              this.pickupName = this.booking?.destinationAddress?.name;
              this.pickupSuburb = this.booking?.destinationAddress?.suburb;
              this.pickupTown = this.booking?.destinationAddress?.town;
              this.pickupLatitude =
                this.booking?.collectionAddress?.coordinate?.latitude;
              this.pickupLongitude =
                this.booking?.collectionAddress?.coordinate?.longitude;
            }
          }
          if (this.isAirportDropOff) {
            
            this.vehicleFinderForm.controls['dropoffflightno'].setValue(
              this.booking.destinationAddress?.flightNumber??""
            );
            this.vehicleFinderForm.controls['dropOffAirport'].setValue(
              this.booking.dropOffAirport
            );
          } else {
            if (this.booking.dropOff) {
              
              this.googleDropOff = this.booking.dropOff;
              this.dropOffName = this.booking?.destinationAddress?.name;
              this.dropOffSuburb = this.booking?.destinationAddress?.suburb;
              this.dropOffTown = this.booking?.destinationAddress?.town;
              this.dropOffLatitude =
                this.booking?.destinationAddress?.coordinate?.latitude;
              this.dropOffLongitude =
                this.booking?.destinationAddress?.coordinate?.longitude;
            }
          }
          this.pickUpDate = this.booking.collectionDateTime;
          this.dropOffDate = this.booking.destinationDateTime;
          if (this.dropOffDate) {
            this.endMinDate = this.booking.collectionDateTime;
          }
        }
      });
    this.subscriptions?.push(sub);

    this.user = JSON.parse(atob(this.cookieService.get('avis-user')));
    this.getFrequentlyUsedAddresses(this.user);
  }

  isDisabled(){
 
    if( this.isAirportDropOff){
      if(this.vehicleFinderForm.value.dropoffflightno == ''){
        return true;
      }
    }
    if( this.isAirportPickUp){
      if(this.vehicleFinderForm.value.pickupflightno == ''){
        return true;
      }
    }

    return false
  }

  getDropOffDate() {
    if (!this.dropOffDate) return;
    return typeof this.dropOffDate == 'string'
      ? this.dropOffDate
      : this.formatDateToISO(this.dropOffDate.toString());
  }
  getPickUpDate() {
    if (!this.pickUpDate) return;
    if (typeof this.pickUpDate == 'string') {
      return this.pickUpDate;
    } else {
      return this.formatDateToISO(this.pickUpDate.toString());
    }
  }

  back(){
    this.router.navigateByUrl('/available-booking-types');
    // available-booking-types
  }

  formatDateToISO(inputDateStr: string) {
    // Parse the input date string
    const inputDate = new Date(inputDateStr);

    // Get date components
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const day = String(inputDate.getDate()).padStart(2, '0');
    const hours = String(inputDate.getHours()).padStart(2, '0');
    const minutes = String(inputDate.getMinutes()).padStart(2, '0');
    const seconds = String(inputDate.getSeconds()).padStart(2, '0');
    const milliseconds = String(inputDate.getMilliseconds()).padStart(3, '0');

    // Construct the ISO 8601 format string
    const isoString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

    return isoString;
  }

  setDate(event: any, type: string): void {
    if (type === 'start') {
      this.pickUpDate = new Date(event.detail.value);
      this.endMinDate = new Date(event.detail.value).toISOString();
      if (this.booking.bookingType.id == 3) {
        let result = new Date(event.detail.value);
        let _result = new Date(event.detail.value);
        result.setDate(result.getDate() + 1);
        this.maxEndDate = result.toISOString();
        this.dropOffDate = _result;
      }
     
      if(this.booking.bookingType.id == 1){
        const _date = new Date(event.detail.value);
         _date.setDate(_date.getDate() + 2);
        // this.setDropOff(_date.toISOString());
        this.dropOffDate = _date;
       
      }
    }
    if (type === 'end') {
      this.dropOffDate = new Date(event.detail.value);
      this.maxStartDate = event.detail.value;
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
  getFrequentlyUsedAddresses(user: any) {
    this.customerService
      .getFrequentlyUsedAddresses(/*user.customerId*/ '0158256')
      .subscribe((data) => this.frequentlyUsedAddresses);
  }
  getAirports() {
    this.bookingService.getAvailableAirports().subscribe((airports) => {
      this.pickUpAirports = this.dropOffAirports = airports.sort((a, b) =>
        a.shortName < b.shortName ? -1 : a.shortName > b.shortName ? 1 : 0
      );
      if (this.booking.dropOffAirport) {
        this.dropOffAirportChange({
          detail: {
            value: this.booking.dropOffAirport,
          },
        });
      }
      if (this.booking.pickUpAirport) {
        this.pickupAirportChange({
          detail: {
            value: this.booking.pickUpAirport,
          },
        });
      }
    });
  }
  ngOnInit() {
  }
  ionViewDidEnter() {
    this.wizardNumber = atob(this.cookieService.get('avis-user'));
  }
  pickupAirportChange(e: any) {
    const selectedAirport = this.pickUpAirports.find(
      (a: any) => a.townBoundName == e.detail.value
    );
    this.pickupName = selectedAirport?.townBoundName;
    this.pickupLatitude = parseFloat(selectedAirport.y);
    this.pickupLongitude = parseFloat(selectedAirport.x);
  }

  dropOffAirportChange(e: any) {
    const selectedAirport = this.dropOffAirports.find(
      (a: any) => a.townBoundName == e.detail.value
    );
    this.dropOffName = selectedAirport?.townBoundName;
    this.dropOffLatitude = parseFloat(selectedAirport.y);
    this.dropOffLongitude = parseFloat(selectedAirport.x);
  }

  doSearch() {
    const identifier =
      this.booking.bookingType.id == 2
        ? 'P2P'
        : this.booking.bookingType.id == 3
        ? 'ACD'
        : 'ALC';

    let payload = {
      collectionAddress: {
        coordinate: {
          latitude: this.pickupLatitude,
          longitude: this.pickupLongitude,
        },
        locationType: this.isAirportPickUp ? 'AIRPORT' : 'STREET',
        name: this.pickupName,
        streetBuildingName: this.pickstreetBuildingName,
        suburb: this.isAirportPickUp ? this.pickupName : this.pickupSuburb,
        town: this.isAirportPickUp ? this.pickupName : this.pickupTown,
        streetNumber: this.isAirportPickUp ? '0' : this.pickupStreetNumber,
        streetNumberExt: '0',
        airportFlightNumber: this.vehicleFinderForm.value.pickupflightno,
      },
      collectionDateTime: this.datePipe.transform(
        this.pickUpDate,
        'yyyy-MM-ddTHH:mm:ss'
      ),
      destinationAddress: {
        coordinate: {
          latitude: this.dropOffLatitude,
          longitude: this.dropOffLongitude,
        },
        locationType: this.isAirportDropOff ? 'AIRPORT' : 'STREET',
        name: this.dropOffName,
        streetBuildingName: this.dropOffstreetBuildingName,
        suburb: this.isAirportDropOff ? this.dropOffName : this.dropOffSuburb,
        town: this.isAirportDropOff ? this.dropOffName : this.dropOffTown,
        streetNumber: this.isAirportDropOff ? '0' : this.dropOffStreetNumber,
        streetNumberExt: '0',
        airportFlightNumber: this.vehicleFinderForm.value.dropoffflightno,
      },
      // destinationDateTime: this.dropOffDate,
      destinationDateTime:
        this.booking.bookingType.id == 2
          ? this.datePipe.transform(this.pickUpDate, 'yyyy-MM-ddTHH:mm:ss')
          : this.datePipe.transform(this.dropOffDate, 'yyyy-MM-ddTHH:mm:ss'),
      pax: 1,
      rateIdentifier: 'WIZARDNUMBER',
      // rateNumber: '8MJ59E',
      rateNumber: this.user.customerId,
      serviceTypeCode: identifier,
    } as any;

    this.store.dispatch(loadVehicles(payload));

    const booking = {
      ...this.booking,
      ...this.vehicleFinderForm.value,
      dropOffDate: this.dropOffDate,
      pickUpDate: this.pickUpDate,
      ...payload,
      IsAirportDropOff: this.isAirportDropOff,
      IsAirportPickUp: this.isAirportPickUp,
    };
    this.store.dispatch(addBooking({ booking }));
  }
  enablePickUpAirport(event: any) {
    this.isAirportPickUp = event.detail.checked;
  }
  enableDropOffAirport(event: any) {
    this.isAirportDropOff = event.detail.checked;
  }

  setDropOff(event: any) {
    
    this.dropOffstreetBuildingName =  `${event.streetBuildingName}`;
    this.dropOffStreetNumber = event.streetNumber;
    (this.dropOffName = `${event?.structured_formatting?.main_text}`), 
    (this.dropOffSuburb = event.suburb);
    this.dropOffTown = event.town;
    (this.dropOffLatitude = event.lat), (this.dropOffLongitude = event.lng);
  }
  setPickUp(event: any) {
    
    this.pickstreetBuildingName = `${event.streetBuildingName}`;
    (this.pickupName = `${event?.structured_formatting?.main_text}`),
      (this.pickupSuburb = event.suburb),
      (this.pickupTown = event.town),
      ((this.pickupLatitude = event.lat),
      (this.pickupStreetNumber = event.streetNumber));
    this.pickupLongitude = event.lng;
  }
}
