import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { addBooking } from 'src/app/store/bookings/bookings.actions';
import { BottomMenuPage } from 'src/app/shared/bottom-menu/bottom-menu.page';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.page.html',
  styleUrls: ['./vehicle-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BottomMenuPage],
})
export class VehicleDetailsPage implements OnInit {
  vehicle$ = this.store.select((store: any) => store.vehicles.currentVehicle);
  selectedAccessories: any[] = [];
  booking: any;
  additionalDriversRange = [0, 1, 2, 3, 4, 5, 6];
  accessoriesTotal = 0;
  selectedAdditionalDrivers: number | undefined = undefined;
  snugRange = [];
  extraRanges: any[] = [];
  constructor(
    private store: Store,
    private router: Router,
    private location: Location,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.store
      .select((store: any) => store.bookings)
      .subscribe((res) => {
        this.booking = res.selectedBooking;
        this.selectedAccessories = res.selectedBooking.selectedAccessories;

        this.booking.vehicle.vehicleExtras?.vehicleExtra?.forEach(
          (extra: any) => {
            this.extraRanges[extra.code] = this.generateRange(
              extra,
              parseInt(this.booking.vehicle.maxPassengers)
            );
            if (this.selectedAdditionalDrivers === undefined) {
              if (
                extra.description == 'ADDITIONAL DRIVER' &&
                this.booking.additionalDrivers?.length > 0
              ) {
                this.selectedAdditionalDrivers =
                  this.booking.additionalDrivers.length;
                this.addRemoveOption(
                  {
                    detail: {
                      value: this.booking.additionalDrivers.length.toString(),
                    },
                  },
                  extra
                );
              } else {
                this.selectedAdditionalDrivers = 0;
              }
            }
          }
        );
        console.log(this.extraRanges);
      });

  }
  rowBreak = false;
  ngOnInit() {}

  back(){
    this.router.navigateByUrl('/available-vehicles');
    // available-booking-types
  }
  getExtraTotal(extra: any) {
    const res = parseFloat(extra.cost) * parseFloat(extra.qty);
    return res;
  }

  filteredAccessories() {
    return this.selectedAccessories.filter(
      (accessory) => accessory.qty != 0
    );
  }

  onConfirmVehicle() {
    const updatedBooking = {
      ...this.booking,
      selectedAccessories: this.selectedAccessories,
    };
    this.store.dispatch(addBooking({ booking: updatedBooking }));
    if (this.booking.bookingType.id == 1) {
      this.router.navigateByUrl('/additional-drivers');
    } else {
      this.router.navigateByUrl('/main-passenger');
    }
  }
  onChangeVehicle() {
    this.router.navigateByUrl('/available-vehicles');
  }

  onViewSummary() {
    this.router.navigateByUrl('/rental-summary');
  }
  addRemoveOption(event: any, extra: any, applyChangeDetection = false) {
    this.selectedAccessories = this.selectedAccessories.filter(
      (accessory) => accessory.option !== extra.description
    );
    if (event.detail.value != '0') {
      this.selectedAccessories.push({
        option: extra.description,
        cost: extra.price,
        qty: event.detail.value,
        code: extra.code,
      });

      const seatExtras = this.selectedAccessories.filter(
        (a) => a.code == '13' || a.code == '14'
      );
      let totalSeatsExtras = seatExtras.reduce(
        (acc: any, curr: any) => acc + parseFloat(curr.qty),
        0
      );
      totalSeatsExtras =
        parseInt(this.booking.vehicle.maxPassengers) - totalSeatsExtras;
      this.booking.vehicle.vehicleExtras.vehicleExtra.forEach((e: any) => {
        if (e.code != extra.code && (e.code == '13' || e.code == '14')) {
          this.extraRanges[e.code] = this.generateRange(e, totalSeatsExtras);
        }
      });
      if (applyChangeDetection) this.changeDetectorRef.detectChanges();
    }

    const updatedBooking = {
      ...this.booking,
      // selectedAccessories: this.selectedAccessories,
    };
    this.store.dispatch(addBooking({ booking: updatedBooking }));

    console.log(this.selectedAccessories);
    this.updateAccessoriesTotal();
  }

  // generateRangeForPassengers() {
  //
  //   var max = parseInt(this.booking.vehicle.maxPassengers);
  //   if (max < 0) {
  //     return [];
  //   }
  // const _max =  Array.from({ length: max + 1 }, (_, index) => index);
  //   return _max;
  // }

  addPassengers(event: any) {
    console.log(this.selectedAccessories);
    this.updateAccessoriesTotal();
  }

  updateAccessoriesTotal() {
    this.accessoriesTotal = this.selectedAccessories.reduce(
      (acc, curr) => acc + parseFloat(curr.cost) * curr.qty,
      0
    );
  }

  viewRentalSummary() {}
  generateRange(extra: any, maxValue: any): number[] {
    const options = [];
    if (extra.description == 'ADDITIONAL DRIVER') {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }

    if (
      (extra.code == '13' || extra.code == '14') &&
      parseInt(extra.maxAllowed) > parseInt(maxValue)
    ) {
      for (let i = 1; i <= parseInt(maxValue); i++) {
        options.push(i);
      }
    } else {
      for (let i = 1; i <= parseInt(extra.maxAllowed); i++) {
        options.push(i);
      }
    }

    return options;
  }
}
