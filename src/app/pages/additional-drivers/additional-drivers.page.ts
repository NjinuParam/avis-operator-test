import { Component, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonModal, IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';

import { BottomMenuPage } from '../../shared/bottom-menu/bottom-menu.page';
import { Router } from '@angular/router';
import { addBooking } from 'src/app/store/bookings/bookings.actions';
import { IDocumentUpload } from 'src/app/interfaces/booking.interface';
import { Camera, CameraPhoto, CameraResultType } from '@capacitor/camera';
import { ToastService } from 'src/app/services/toast.service';
import { Customerservice } from 'src/app/services/customer.service';
import * as moment from 'moment';
@Component({
  selector: 'app-additional-drivers',
  templateUrl: './additional-drivers.page.html',
  styleUrls: ['./additional-drivers.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BottomMenuPage,
  ],
})
export class AdditionalDriversPage {
  additionalDriverForm = this.fb.group({
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    idNumber: ['', [Validators.required]],
    licence: ['', [Validators.required]],
    note: ['', [Validators.required]],
    title: ['', [Validators.required]],
    licenceImage: [''],
    stageNumber: [''],
    lineNumber: [''],
  });
  canAddDriver: boolean = false;
  subscription: any;
  formvalues: any = {};
  booking: any;
  additionalDrivers: any[] = [];
  previousDrivers: any[] = [];
  additionalDriversCount = 0;
  files: any[] = [];
  licenceImage: any;
  passenger: any;
  maxDOb = new Date().toISOString();
  driverBob: string | undefined = undefined;
  formDisabled : boolean = false;
  @ViewChild(IonModal) modal!: IonModal;
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private location: Location,
    private toast: ToastService,
    private customerService: Customerservice
  ) {
    this.store
      .select((store: any) => store.bookings)
      .subscribe((res) => {
        this.booking = res.selectedBooking;
        const maxAdditionalDriver = this.booking?.selectedAccessories?.filter(
          (access: any) => access.option === 'ADDITIONAL DRIVER'
        );
        console.log('maxAdditionalDriver', maxAdditionalDriver);
        if (maxAdditionalDriver) {
          this.additionalDriversCount = maxAdditionalDriver[0]?.qty
            ? parseInt(maxAdditionalDriver[0].qty)
            : 0;
        } else {
          this.additionalDriverForm.disable();
        }
      });
    this.onPreviousDrivers();
    if (this.booking.serviceTypeCode === 'ALC') {
      
      const _driver = {
        title: this.booking.customer.customerTitles,
        name: this.booking.customer.customerFullNames,
        surname: this.booking.customer.customerSurname,
        lineNumber: '',
        licence: this.booking.customer?.licPpnNumber,
        stageNumber: '',
        idNumber: this.booking?.customer?.customerIdPassport,
        dob: this.booking?.customer?.dateOfBirth,
      };

      const _addDrivers = this.additionalDrivers.filter((x)=>{
        return x.name.toLowerCase() == _driver.name.toLowerCase() && x.surname.toLowerCase() == _driver.surname.toLowerCase();

      });
      debugger;
      if(_addDrivers.length == 0)
      this.additionalDrivers.push(_driver);
      this.passenger = {
        title: _driver.title,
        name: _driver.name,
        surname: _driver.surname,
        idNumber: _driver.idNumber,
      };
      // if (
      //   this.booking.additionalDrivers &&
      //   this.booking.additionalDrivers.length > 0
      // ) {
      //   this.additionalDrivers = [
      //     ...this.additionalDrivers,
      //     ...this.booking.additionalDrivers.filter(
      //       (driver: any, index: number) => index < this.additionalDriversCount
      //     ),
      //   ];
      // }
    }
  }
  checkDOb(event: any) {
    console.log(event.detail.value);

    const selectedDate = new Date(event.detail.value);
    const diff = selectedDate.setFullYear(selectedDate.getFullYear() + 25);
    if (diff > new Date().getTime()) {
      this.toast.showToast(
        'Kindly note: The minimum age for Avis Luxury Car Rentals is 25 years and above. Renters be-tween 21 & 25 will be at managers discretion and a young driver’s surcharge will apply. This does not apply to Chauffeur Drive services.',
        3000
      );
    }
    this.driverBob = event.detail.value;
    this.checkValid();
  }
  checkValid(dobVerified: boolean = false) {
    debugger;
    this.canAddDriver =
      this.additionalDriverForm.value.name != null &&
      this.additionalDriverForm.value.name != '' &&
      this.additionalDriverForm.value.surname != null &&
      this.additionalDriverForm.value.surname != '' &&
      this.additionalDriverForm.value.title != null &&
      this.additionalDriverForm.value.title != '' &&
      this.additionalDriverForm.value.idNumber != null &&
      this.additionalDriverForm.value.idNumber != '' &&
      this.additionalDrivers.length < this.additionalDriversCount + 1 &&
      (this.driverBob != undefined || !dobVerified);
  }

  back(){
    this.router.navigateByUrl('/vehicle-details');

  }

  getDate(){
    var date =  this.driverBob;
    
    const p =  moment(date).toDate();
    return this.formatDateToISO(p.toString());
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

  onNext() {
    const updatedBooking = {
      ...this.booking,
      additionalDrivers: this.additionalDrivers,
      passengers: [this.passenger],
      backUrl: '/additional-drivers',
      _uploadFiles:
        this.files.length > 0
          ? [...(this.booking._uploadFiles ?? []), ...this.files]
          : [...(this.booking._uploadFiles ?? [])],
    };
    this.store.dispatch(addBooking({ booking: updatedBooking }));

    this.router.navigateByUrl('/add-note');
  }
  onBack() {
    this.location.back();
    // this.router.navigateByUrl('/vehicle-details');
  }

  confirm() {
    this.modal.dismiss();
  }
  onPreviousDrivers() {
    this.customerService
      .getFrequentlyUsedDrivers(this.booking.customer.customerId)
      .subscribe(
        (response: any) =>
          { 
            debugger;
            const driv =  response?.getStageDriverDetailsOutput?.results.filter((x:any)=>x.driverSurname.toLowerCase() != this.booking.customer.customerSurname.toLowerCase() && x.driverFisrtName.toLowerCase() != this.booking.customer.customerFullNames.toLowerCase());
            this.previousDrivers = driv;
           } 
      );
  }
  public async takePhoto(driver: any) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });
    var imageUrl = image.webPath;

    // Can be set to the src of an image now
    driver.licenceImage = imageUrl;
  }
  addDriverFromList(event: any, driver: any) {
    console.log(event);
    driver.avisAppId = driver.avisAppId ?? new Date().getTime();
    driver.canDeselect = false;
    
    const _driver = {
      title: driver.driverTitle,
      name: driver.driverFisrtName,
      surname: driver.driverSurname,
      licence: driver.driverLicenseCode,
      idNumber: driver.driverIdNumber,
      avisAppId: driver.avisAppId,
      driverDateOfBirth: driver.driverDateOfBirth,
    };

        this.additionalDriverForm.setValue({
          name: _driver.name,
          surname:_driver.surname,
          idNumber: _driver.idNumber,
          licence: _driver.licence??"",
          note: "",
          title:_driver.title,
          licenceImage: "",
          stageNumber: "",
          lineNumber: "",
        });
        this.driverBob = this.formatDateToISO(_driver.driverDateOfBirth);
        driver.canDeselect = true;
        this.checkValid(true);
      // } 

    // }
    if (this.additionalDrivers.length >= this.additionalDriversCount + 1) {
      this.toast.showToast(
        'You have added the maximum number of additional drivers.',
        3000
      );
      
    }
    this.confirm();
  }
  addDriver() {
    const addedDriver = {
      ...this.additionalDriverForm.value,
      licenceImage: this.licenceImage,
      dob: this.driverBob,
    };


    this.additionalDrivers = [...this.additionalDrivers, addedDriver];
   
    
    if (this.additionalDrivers.length >= this.additionalDriversCount + 1) {
      this.additionalDriverForm.disable();
      this.formDisabled = true;
    }
    this.additionalDriverForm.reset();
    this.driverBob = undefined;
  }
  // getFile(event: any, name: string) {
  //   this.file = event.target.files[0];
  //   // this.payload.set(name, this.file);
  // }
  deleteDriver(index: number) {
    const driver = this.additionalDrivers[index];
    const prevAddedDriver = this.previousDrivers.find(
      (d) => d.avisAppId === driver.avisAppId
    );
    if (prevAddedDriver) {
      prevAddedDriver.canDeselect = false;
    }
    this.additionalDriverForm.enable();
    this.formDisabled = false;
    this.additionalDrivers = this.additionalDrivers.filter(
      (x: any, i: number) => i != index
    );
  }

  addLicence(fileChangeEvent: any) {
    const passengerDetails = this.additionalDriverForm.value;
    const passengerDocumentId = `${passengerDetails.idNumber}-licence`;
    // Get a reference to the file that has just been added to the input
    const document = fileChangeEvent.target.files[0];
    const documentBlob = new Blob([document], { type: document.type });

    const fileUpload = {
      _file: documentBlob,
      fileType: document.type,
      document: 'drivers-licence',
      wizardNumber: '',
      name: passengerDocumentId,
    } as IDocumentUpload;

    this.files = [...this.files, fileUpload];
    console.log('document', fileUpload);
  }



  

  takePicture = async (event: any) => {
   
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });

 
    this.licenceImage = image.base64String;
    this.files = [...this.files, image.webPath];

    
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    var imageUrl = image.webPath ?? '';
    this.additionalDriverForm.get('licenceImage')?.setValue(imageUrl);
    const name = `${this.additionalDriverForm.get('title')?.value} ${
      this.additionalDriverForm.get('name')?.value
    } ${this.additionalDriverForm.get('surname')?.value}`;
    this.toast.showToast(`Licence captured for ${name}`);
  };
}
