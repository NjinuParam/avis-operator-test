import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonModal, IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Passenger } from 'src/app/interfaces/passenger.interface';
import { addPassenger } from 'src/app/store/passenger/passengers.actions';
import { BottomMenuPage } from '../../shared/bottom-menu/bottom-menu.page';
import { Router } from '@angular/router';
import {
  addBooking,
  setBackUrl,
} from 'src/app/store/bookings/bookings.actions';
import { IDocumentUpload } from 'src/app/interfaces/booking.interface';
import { ToastService } from 'src/app/services/toast.service';
import { noteBackUrl } from 'src/app/store/note/note.actions';
import { Customerservice } from 'src/app/services/customer.service';

@Component({
  selector: 'app-main-passenger',
  templateUrl: './main-passenger.page.html',
  styleUrls: ['./main-passenger.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BottomMenuPage,
  ],
})
export class MainPassengerPage {
  formvalues: any = {};
  mainPassengerForm = this.fb.group({
    title: ['', Validators.required],
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    contact: ['', [Validators.required]],
    note: ['', [Validators.required]],
    idNumber: ['', [Validators.required]],
  });
passengers:any[]=[];
  canAddCustomer: boolean = false;
  mainPassengerIsCustomer: boolean = true;
  files: any[] = [];
  maxPassengers = 1;
  previousDrivers: any[] = [];
  @ViewChild(IonModal) modal!: IonModal;
  booking: any;
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private toast: ToastService,
    private customerService: Customerservice
  ) {
    this.store
      .select((store: any) => store.bookings.selectedBooking)
      .subscribe((res) => {
        this.booking = res;
        if (this.booking) {
          if (this.booking.vehicle && this.booking.vehicle?.maxPassengers) {
            this.maxPassengers = parseInt(this.booking.vehicle.maxPassengers);
            this.passengers = this.booking.passengers;
          }
        }
      });

    if (!this.booking.passengers) {
      const updatedBooking = {
        ...this.booking,
        passengers: [],
      };
      this.store.dispatch(addBooking({ booking: updatedBooking }));
    }

    this.onPreviousDrivers();
    this.toggleMainPassenger();
  }

  back(){
    this.router.navigateByUrl('/vehicle-details');

  }
  addDriverFromList(event: any, driver: any) {
    console.log(event);
    driver.avisAppId = driver.avisAppId ?? new Date().getTime();
    driver.canDeselect = false;
   

    const _pass = {
      title: driver.driverTitle,
      name: driver.driverFisrtName,
      surname: driver.driverSurname,
      // idNumber: driver.driverIdNumber,
      contacts: this.booking.customer.cellNumber,
    };

    if (this.passengers.length < this.maxPassengers ){
      this.passengers = [...this.passengers, _pass];
    }

    if (this.passengers.length == this.maxPassengers ) {
      this.toast.showToast(
        'You have added the maximum number of passengers.',
        3000
      );
    }
  }

  onPreviousDrivers() {
    this.customerService
      .getFrequentlyUsedDrivers(this.booking.customer.customerId)
      .subscribe(
        (response: any) =>
          {
            debugger;
            this.previousDrivers =
            response?.getStageDriverDetailsOutput?.results.filter((x:any)=>x.driverFisrtName.toLowerCase()!= this.booking.customer.customerFullNames.toLowerCase() && x.driverSurname.toLowerCase()!= this.booking.customer.customerSurname.toLowerCase());}
      );
  }
  
  checkValid() {
    this.canAddCustomer =
      this.mainPassengerForm.value.title != null &&
      this.mainPassengerForm.value.title != '' &&
      this.mainPassengerForm.value.name != null &&
      this.mainPassengerForm.value.name != '' &&
      this.mainPassengerForm.value.surname != null &&
      this.mainPassengerForm.value.surname != '' &&
      this.booking.passengers.length < this.maxPassengers;
  }
  confirm() {
    this.modal.dismiss();
  }
  addPassenger() {
    let passengers = [];
    if (this.booking.passengers|| this.passengers.length >0) {
      passengers = [...this.booking.passengers, this.mainPassengerForm.value];
      this.passengers = [...this.passengers, this.mainPassengerForm.value];
    } else {
      passengers.push(this.mainPassengerForm.value);
      this.passengers.push(this.mainPassengerForm.value);
    }
    this.mainPassengerForm.reset();
    this.canAddCustomer = false;
    if (this.booking.passengers.length >= this.maxPassengers) {
      this.mainPassengerForm.disable();
    }
  }

  toggleMainPassenger() {
    const _pass = {
      title: this.booking.customer.customerTitles,
      name: this.booking.customer.customerFullNames,
      surname: this.booking.customer.customerSurname,
      idNumber: this.booking.customer.customerIdPassport,
      contacts: this.booking.customer.cellNumber,
    };

    var s = this.booking.passengers.filter((x:any)=>x.name.toLowerCase() ==this.booking.customer.customerFullNames.toLowerCase() || x.surname.toLowerCase() == this.booking.customer.customerSurname.toLowerCase()).length==0
    debugger;
    if (s) {
     this.passengers= 
         [_pass, ...this.passengers];
      
    } 
  }

  deleteCustomer(index: number) {
    const passengers = this.passengers.filter(
      (x: any, i: number) => i != index
    );
    // const updatedBooking = {
    //   ...this.booking,
    //   passengers,
    // };
    // console.log('Update', updatedBooking);
    // this.store.dispatch(addBooking({ booking: updatedBooking }));
    this.passengers = passengers;
     const updatedBooking = {
      ...this.booking,
      passengers:this.passengers,
    };
    console.log('Update', updatedBooking);
    this.store.dispatch(addBooking({ booking: updatedBooking }));

    this.mainPassengerForm.enable();
  }
  onNext() {
    if (this.passengers.length === 0) {
      this.toast.showToast(
        'You need to add at least one passenger to your booking'
      );
      return;
    }
    const updatedBooking = {
      ...this.booking,
      passengers:this.passengers,
      _uploadFiles:
        this.files.length > 0
          ? [...(this.booking._uploadFiles ?? []), ...this.files]
          : [...(this.booking._uploadFiles ?? [])],
    };

    console.log('Update', updatedBooking);
    this.store.dispatch(addBooking({ booking: updatedBooking }));
  
    this.mainPassengerForm.reset();

    this.store.dispatch(
      setBackUrl({
        booking: {
          ...this.booking,
          backUrl: '/main-passenger',
        },
      })
    );
    this.router.navigateByUrl('/add-note');
  }

  onBack() {
    this.router.navigateByUrl('/vehicle-details');
  }

  addIdDocument(fileChangeEvent: any) {
    const passengerDetails = this.mainPassengerForm.value;
    const passengerDocumentId = `${passengerDetails.idNumber}-iddocument`;
    // Get a reference to the file that has just been added to the input
    const document = fileChangeEvent.target.files[0];
    const documentBlob = new Blob([document], { type: document.type });

    const fileUpload = {
      _file: documentBlob,
      fileType: document.type,
      document: 'id-document',
      wizardNumber: '',
      name: passengerDocumentId,
    } as IDocumentUpload;

    this.files = [...this.files, fileUpload];
    console.log('document', fileUpload);
  }
}
