import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import {
  addBooking,
  clearInprogressBookings,
} from 'src/app/store/bookings/bookings.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { IBookingType } from 'src/app/interfaces/bookingType.interface';
import { BottomMenuPage } from '../../shared/bottom-menu/bottom-menu.page';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { Customerservice } from 'src/app/services/customer.service';
import { Subscription, firstValueFrom, take } from 'rxjs';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-available-booking-types',
  templateUrl: './available-booking-types.page.html',
  styleUrls: ['./available-booking-types.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BottomMenuPage,
    ReactiveFormsModule,
  ],
})
export class AvailableBookingTypesPage implements OnInit {
  bookingTypes: IBookingType[] | undefined;
  selectedBookingType: IBookingType | undefined;
  selectedVehicleAllocation: number | undefined;
  subscriptions: Subscription[] = [];
  pastBookingId: any;
  legIndex = 0;
  pastBookings: any[] = [];
  booking: any;
  loggedInUser = {} as any;
  isEdit = false;
  pastBookingForm = this.fb.group({
    pastBookingList: [''],
  });
  // newBookingForm = this.fb.group({
  //   newBookingsList: [''],
  // });
  user: any;
  constructor(
    private store: Store,
    private toastService: ToastService,
    private router: Router,
    private userService: AuthService,
    private cookieService: CookieService,
    private bookingService: BookingService,
    private customerService: Customerservice,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.selectedBookingType = undefined;
      this.isEdit = params['edit'] ? true : false;
      if (!this.isEdit) {
        this.store.dispatch(addBooking({ booking: null }));
      }
      this.pastBookingForm.reset();
      // this.newBookingForm.reset();
    });
   

const _user = JSON.parse(atob(this.cookieService.get('avis-user')));

      this.bookingService.getBookingManifestByCustomerCode(
        _user.customerId
      ).subscribe({
        next: (bookings: any) => {
          const allBookings = [...bookings.upcomingBookings, ...bookings.historicBookings];
          let legCount = 0;

          const ordered = allBookings.sort(function (a:any, b:any) {

                  var nameA = a.bookingId.toLowerCase(), nameB = b.bookingId.toLowerCase()
              
                  if (nameA < nameB)
                    return 1;
                  if (nameA > nameB)
                    return -1;
                  return 0;  // No sorting
              })
        


          for (let i = 0; i < ordered.length; i++) {
                  if (ordered[i].legs.length <= 3) {
                    this.pastBookings.push(ordered[i]);
                    legCount += ordered[i].legs.length;
                    if (legCount >= 3) {
                      break;
                    }
                  } else {
                    const b = {
                      ...ordered[i],
                      legs: ordered[i].legs.filter(
                        (leg: any, index: number) => index < 3 - legCount
                      ),
                    };
                    this.pastBookings.push(b);
                    legCount += b.legs.length;
                    if (legCount >= 3) break;
                  }
            }

 
     
        },
        error: (err) => {

        },
      });
    

    this.store
      .select((store: any) => store.bookingTypes.bookingTypes)
      .subscribe((res) => {
        
        this.bookingTypes = res;
      });

    this.store
      .select((store: any) => store.bookings)
      .subscribe((res) => {
        this.booking = res.selectedBooking;
      
        if (this.booking) {
          
          console.log('SEL', res.serviceTypeDescription);
          if(res.selectedBooking.serviceTypeDescription){
            const type = res.selectedBooking.serviceTypeDescription.toLowerCase().includes("disposal") 
            ?{ id:3, number: 3, name: 'CHAUFFEUR DRIVE DISPOSAL', description: 'CHAUFFEUR DRIVE DISPOSAL', avisCode: 'CDD'}
            :res.selectedBooking.serviceTypeDescription.toLowerCase().includes("luxury")
            ? {id:1, number: 1, name: 'AVIS LUXURY CARS', description: 'AVIS LUXURY CARS', avisCode: 'ALC'}
            : {id:2, number: 2, name: 'CHAUFFEUR DRIVE TRANSFER', description: 'CHAUFFEUR DRIVE TRANSFER', avisCode: 'P2P'};
            
      this.selectedBookingType =   type;
          }
        
        }
      });
  }
  selectedBookTypeChange(event: any) {
    this.pastBookingId = null;
    this.legIndex = -1;
    this.pastBookingForm.reset();
    this.selectedBookingType = this.bookingTypes?.find(
      (b: any) => b.id == event.detail.value
    );
  }
  pastBookingSelected(event: any, bookingId: any, legIndex: number) {
    this.selectedBookingType = undefined;
    this.pastBookingId = bookingId;
    this.legIndex = legIndex;
  }
  ionViewDidEnter() {
    this.getUser();
  }

  back(){
    this.router.navigateByUrl('/bookings');
  }
  cancel() {
    this.router.navigateByUrl('/bookings');
  }

  getUser() {
    var user = JSON.parse(atob(this.cookieService.get('avis-user')));
    const emailAddress = user.emailAddress;
    // this.customerId = user.customerId;

    this.userService.getUserByEmail(emailAddress).subscribe((user: any) => {
      this.user = user;
      if (user.customerId) {
        this.getCustomer(user.customerId);
      } else {
        this.toastService
          .showToast('Please complete your profile in order to make a booking.')
          .then((x) => {
            this.router.navigateByUrl('/profile');
          });
      }
    });

    console.log('userhere', this.loggedInUser);
  }

  getCustomer(user: any) {
    this.customerService.getCustomer(user).subscribe({
      next: (_customer: any) => {
        let _booking: any;

        if (this.booking) {
          _booking = {
            ...this.booking,
            customer: _customer,
          };
        } else {
          _booking = {
            customer: _customer,
          };
        }

        this.store.dispatch(addBooking({ booking: _booking }));
      },
      error: (err: any) => {
        console.log('error', err);
        this.toastService.showToast(
          'An error occured while retrieving your profile'
        );
      },
    });
  }

  ngOnInit() {}
  async getBooking(bookingId: string) {
    const booking$ = this.bookingService
      .getBookingsByBookingId(bookingId)
      .pipe(take(1));

    return firstValueFrom(booking$);
  }
  async findAvehicle() {
    if (this.pastBookingId) {
      const booking = await this.getBooking(this.pastBookingId);
      console.log(booking);
      const mapped = this.mapLegToBooking(booking);
      this.store.dispatch(addBooking({ booking: mapped[this.legIndex] }));
      this.store.dispatch(clearInprogressBookings());
      // mapped.forEach((leg: any, i: number) => {
      //   if (0 !== i) {
      //     this.store.dispatch(addToInprogressBookings({ booking: leg }));
      //   }
      // });
    }
    if (!this.selectedBookingType) {
      return;
    }
    let _booking: any;
    if (this.booking) {
      _booking = {
        ...this.booking,
        bookingType: this.selectedBookingType,
      };
    } else {
      _booking = {
        bookingType: this.selectedBookingType,
        id: new Date().getTime(), //TODO: get a proper id somewhere
      };
    }

    this.store.dispatch(addBooking({ booking: _booking }));

    this.router.navigateByUrl('/vehicle-finder');
  }

  
  mapLegToBooking(response: any) {
    var mapped = response.getBookingResult.legs.leg.map((x: any) => {
      
      return {
        ...x,
        bookingType: this.bookingTypes?.find(
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
  vehicleAllocationChange(event: any) {
    this.selectedBookingType = this.bookingTypes?.find(
      (bt) => bt.id === event.detail.value.bookingTypeId
    );
  }
}
