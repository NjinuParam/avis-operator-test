import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { RangeValue } from '@ionic/core';
import { RangeCustomEvent } from '@ionic/angular';
import { IAvailableVehicles } from 'src/app/interfaces/availableVehicles.interface';
import { IVehicle } from 'src/app/interfaces/vehicle.interface';
import { addVehicle } from 'src/app/store/vehicles/vehicles.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { addBooking } from 'src/app/store/bookings/bookings.actions';
import { BottomMenuPage } from '../../shared/bottom-menu/bottom-menu.page';

@Component({
  selector: 'app-available-vehicles',
  templateUrl: './available-vehicles.page.html',
  styleUrls: ['./available-vehicles.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BottomMenuPage],
})
export class AvailableVehiclesPage implements OnInit {
  seats: any;
  doors: number | undefined;
  makeModel: string | undefined;
  availableVehicles: any;
  copyAvailableVehicles: IAvailableVehicles[] = [];
  booking: any;
  avail: number = 0;
  availableOnly = false;
  allVehicles: any[] = [];
  noOfPassengers = 1;
  numberList = [...Array(25).keys()];
  serviceTypeCode: any;
  filterText = 'Filter';
  filteredVehicles: any[] = [];
  allVehiclesOrdered: IVehicle[] = [];
  selectedAccessories:any[] = [];
  selectedExtras: any = [];
  selectedPassengers = '0';
  // fees: any[];
  selectedFilters: any[] = [];
  selectedDoors = '0';
  selectedMakes = '';
  selectedSeats = 0;
  totalSeats = 0;
  totalfees: any;
  selectedFilter: any = { seats: 0, doors: 0, vehicles: [] };
  allExtras: any[];

  constructor(
    private store: Store,
    private router: Router,
    private alertController: AlertController
  ) {
    this.store
      .select((store: any) => {
        console.log('reree');
        // this.availableVehicles = store.vehicles.availableVehicles;
        this.copyAvailableVehicles = JSON.parse(
          JSON.stringify(store.vehicles.availableVehicles)
        );

        this.avail = store.vehicles.availableVehicles?.filter(
          (x: any) => x.isAvailable == 'true'
        ).length;

        if (this.copyAvailableVehicles) {
          this.getBooking();
        }
      })
      .subscribe();

      const vehicles  = this.copyAvailableVehicles.flatMap(x=>x.vehicles??[]);

      const uniqueExtras = this.extractUniqueVehicleExtras( this.copyAvailableVehicles[0].vehicles);

      this.allExtras = uniqueExtras;
      const filt = vehicles.filter((x:any) => x.isAvailable == 'true');
      const unavail = vehicles.filter((x:any) => x.isAvailable != 'true');
      this.filteredVehicles = [...filt, ...unavail];
      this.allVehiclesOrdered = [...filt, ...unavail];
  }
  checkVehicleForPassengers(vehicle: any) {
    return parseInt(vehicle.maxPassengers) >= this.noOfPassengers;
  }
  numberOfPassengersChanged(event: any): void {
    this.noOfPassengers = parseFloat(event.detail.value);
  }

  back(){
    this.router.navigateByUrl('/vehicle-finder');
    // available-booking-types
  }

  toggleAvailable() {
    this.availableOnly = !this.availableOnly;
    if (this.availableOnly) {
      const res = this.allVehicles[0].vehicles.filter(
        (x: any) => x.isAvailable == 'true'
      );

      const vehicles = {
        serviceTypeCode: this.serviceTypeCode,
        vehicles: res,
      };

      this.availableVehicles = [vehicles];
    } else {
      this.availableVehicles = this.allVehicles;
    }
  }

  getExtraTotal(qty:number, cost: any) {
  
    const res = parseFloat(cost.price) * qty;
    return res;
  }

  
  getBooking() {
    this.store

      .select((store: any) => store.bookings)
      .subscribe((res) => {
        this.booking = res.selectedBooking;
      
        let booking = res.selectedBooking;
        if (booking) {
          const dropOffDate = new Date(booking.dropOffDate);
          const pickUpDate = new Date(booking.pickUpDate);

          const diffTime = Math.abs(
            dropOffDate.getTime() - pickUpDate.getTime()
          );
          let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          diffDays = diffDays === 0 ? 1 : diffDays;

          this.copyAvailableVehicles.forEach((availVehicle: any) => {
            availVehicle.vehicles.forEach((vehicle: any) => {
              vehicle.fee.dayRate = vehicle.fee.price / diffDays;
            });
          });
        }

        const filt = this.copyAvailableVehicles[0] as any;
        this.serviceTypeCode = filt.serviceTypeCode;
        const avail = filt.vehicles.filter((x: any) => x.isAvailable == 'true');
        const unnavail = filt.vehicles.filter(
          (x: any) => x.isAvailable != 'true'
        );

        let allProd = [...avail, ...unnavail];

        if (this.booking && this.booking?.vehicleCode) {
          allProd = allProd.sort((a, b) =>
            a.code == this.booking.vehicleCode ? -1 : 0
          );
        }

        const vehicles = {
          serviceTypeCode: this.serviceTypeCode,
          vehicles: allProd,
        };

        this.avail = avail.length;
        this.availableVehicles = [vehicles];
        this.allVehicles = [vehicles];

        if (this.booking && this.booking?.passengers) {
          this.noOfPassengers = this.booking?.passengers.length;
        }

        // this.availableVehicles = this.copyAvailableVehicles;
      });
  }

  async ionViewDidEnter() {
    console.log('No. of vehicles' + this.availableVehicles);
    if (this.availableVehicles == null) {
      const alert = await this.alertController.create({
        header: 'ERROR',
        subHeader: '',
        message: 'No vehicle(s) available for the selected dates/location',
        cssClass: 'otp-alert',
        buttons: [
          {
            text: 'Back',
            cssClass: 'primary-btn',
            handler: () => {
              this.router.navigate(['vehicle-finder']);
            },
          },
        ],
      });
      await alert.present();
    }
  }

  onSeatsChange(ev: any) {
    this.seats = ev.detail.value;
  }

  async applyFilter() {
    this.availableVehicles = JSON.parse(
      JSON.stringify(this.copyAvailableVehicles)
    );
  
    if (this.doors) {

      const newVeh = this.availableVehicles[0].vehicles.filter((y: any)=>y.doors == this.doors);

      this.availableVehicles[0].vehicles = newVeh;
    
      // this.availableVehicles?.forEach((av: any) => {
      //   av.vehicles = av.vehicles.filter(
      //     (v: any) => v.doors == this.doors?.toString()
      //   );
      // });
    }
    if (this.makeModel) {
      this.availableVehicles?.forEach((av: any) => {
        av.vehicles = av.vehicles.filter((v: any) =>
          v.description.toLowerCase().includes(this.makeModel?.toLowerCase())
        );
      });
    }
    if (this.seats) {
      this.availableVehicles?.forEach((av: any) => {
        av.vehicles = av.vehicles
          .filter((v: any) => parseInt(v.maxPassengers) >= this.seats)
          .sort((a: any, b: any) => (a.isAvailable == 'true' ? -1 : 1))
          .sort((a: any, b: any) =>
            a.maxPassengers < b.maxPassengers ? -1 : 1
          );
      });
    }
    this.availableVehicles = this.availableVehicles.sort((a: any, b: any) =>
      a.isAvailable == 'true' ? -1 : 1
    );

    this.availableVehicles.forEach((availVehicles: any) => {
      availVehicles.vehicles = availVehicles?.vehicles?.sort((a: any, b: any) =>
        a.isAvailable == 'true' ? -1 : 1
      );
    });

    this.filteredVehicles = this.availableVehicles[0].vehicles;
  }
  resetFilter() {
    this.seats = this.makeModel = this.doors = undefined;
    this.applyFilter();
    this.filterText = 'Filter';
  }
  viewVehicle(vehicle: IVehicle) {
    if (vehicle.isAvailable?.toString() === 'false') {
      return;
    }
    

    const updatedBooking = {
      ...this.booking,
      vehicle,
      selectedAccessories: this.selectedAccessories
    };
    this.store.dispatch(addVehicle({ vehicle }));
    this.store.dispatch(addBooking({ booking: updatedBooking }));
    this.router.navigate(['vehicle-details']);
  }




  //filters
  extractUniqueVehicleExtras(availableVehicles:any) {
    const uniqueExtras = new Set();
    let uniqueCodes = [] as any [];
    availableVehicles.forEach((vehicle:any) => {
      if (vehicle.vehicleExtras && vehicle.vehicleExtras.vehicleExtra) {
        vehicle.vehicleExtras.vehicleExtra.forEach((extra:any) => {
          if (!uniqueCodes.includes(extra.code)) {
            uniqueExtras.add(extra);

            uniqueCodes.push(extra.code);
          }

          var existing = Array.from(uniqueExtras).filter(
            (x: any) => x.code == extra.code
          ) as any[];
          if (existing.length > 0) {
            var qty = parseInt(existing[0].maxAllowed);
            if (parseInt(extra.maxAllowed) > qty) {
              uniqueExtras.delete(existing[0]);
              uniqueExtras.add(extra);
            }
          }
        });
      }
    });
    return Array.from(uniqueExtras);
  }


  updateAccessoriesTotal() {
    const acctotal = this.selectedAccessories.reduce(
      (acc, curr:any) => acc + parseFloat(curr.cost) * curr.qty,
      0
    );

  }

  range =[1,2,3,4,5,6,7,8,9,10];

  generateRange(extra:any): number[] {

    const options = [];

    if (extra.description == 'ADDITIONAL DRIVER') {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }
   
    for (let i = 1; i <= parseInt(extra.maxAllowed); i++) {
      options.push(i);
    }
    return options;
  }

  ngOnInit(): void {
    
  }
  addRemoveOption(event:any, extra:any) {
    var code = extra.code;
    var max = event.detail.value;
    if (extra.description !== 'ADDITIONAL DRIVER') {
      if (this.selectedFilters.filter((x) => x.code == code).length == 0) {
        this.selectedFilters = [
          ...this.selectedFilters,
          { code: code, max: max },
        ];
      } else {
        const target = this.selectedFilters.filter((x) => x.code !== code);
        this.selectedFilters = [...target, { code: code, max: max }];
      }
    }



    this.selectedAccessories = this.selectedAccessories.filter(
      (accessory) => accessory.option !== extra.description
    );

    if(event.detail.value != 0){
      this.selectedAccessories.push({
          code: extra.code,
          option: extra.description,
          cost: extra.price,
          qty: event.detail.value,
        });
        console.log(this.selectedAccessories);

    }
    
    this.updateAccessoriesTotal();
    this.filter();
  }

  getSeats() {
    const seatExtras = this.selectedFilters.filter(
      (x) =>
        x.code == '56' ||
        x.code == '57' ||
        x.code == '58' ||
        x.code == '13' ||
        x.code == '14' ||
        x.code == '32' ||
        x.code == '31' ||
        x.code == '33' ||
        x.code == '272' ||
        x.code == '269'
    );
    const allSeats = seatExtras.map((x) => x.max);
    const totalSeats = allSeats.reduce((acc, curr) => acc + parseInt(curr), 0);

    this.totalSeats = totalSeats +this.noOfPassengers;

  }

  showSeats(vehicle:any){
    return parseInt(vehicle.maxPassengers)+1;

  }

  filter() {
    const _vehicles = this.allVehiclesOrdered.filter((_vehicle:any) => {
      var extras = _vehicle.vehicleExtras.vehicleExtra;
      var _seats = this.getSeats();

      const allMatch = this.selectedFilters.map((_filter) => {
      const directMatch = extras.filter((y:any) => y.code == _filter.code).length == 0;

        if (directMatch) {
          return false;
        }
        if (
          extras.filter(
            (y:any) =>
              y.code == _filter.code &&
              parseInt(y.maxAllowed) >= parseInt(_filter.max)
          ).length == 0
        ) {
          return false;
        }
        return true;
      });

  //  
        if(parseInt(_vehicle.maxPassengers) <  this.totalSeats){
          return false;
        }
      
      if (this.selectedMakes != '') {
        if (!_vehicle.description.toLowerCase().includes(this.selectedMakes)) {
          return false;
        }
      }


      if (this.totalSeats != 0) {
        if (parseInt(_vehicle.maxPassengers) < this.totalSeats) {
          return false;
        }
      }

      if (
        this.selectedDoors != '0' &&
        !(parseInt(_vehicle.doors) == parseInt(this.selectedDoors))
      ) {
        return false;
      }

      if (allMatch.includes(false)) {
        return false;
      }
      if (this.availableOnly && _vehicle.isAvailable !== 'true') {
        return false;
      }
      return true;
    });

    this.filteredVehicles = _vehicles;
  }




}
