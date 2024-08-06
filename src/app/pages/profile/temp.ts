import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BottomMenuPage } from '../../shared/bottom-menu/bottom-menu.page';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Customerservice } from 'src/app/services/customer.service';
import { ICustomer } from 'src/app/services/map/ICustomer';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BottomMenuPage,
  ],
})
export class ProfilePage implements OnInit {
  monthYears: any[] = [];
  loggedInUser = {} as any;
  titles: any[] = [
    { value: 'MR', label: 'Mr' },
    { value: 'MS', label: 'Ms' },
    { value: 'MRS', label: 'Mrs' },
    { value: 'DR', label: 'Dr' },
  ];
  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      cssClass: 'secondary',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      cssClass: 'primary',
      handler: () => {
        this.deleteProfile();
      },
    },
  ];
  title: string = '';
  user: any;
  customer: ICustomer | undefined;
  customerId: string | undefined;
  ccHolder: string = '';
  profileForm = this.fb.group({
    title: ['', Validators.required],
    firstname: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    cellPhone: ['', [Validators.required]],
    billingAddressLine1: ['', [Validators.required]],
    billingAddressLine2: ['', [Validators.required]],
    email: [
      this.loggedInUser?.emailAddress ?? '',
      [Validators.required, Validators.email],
    ],
    dateOfBirth: ['', [Validators.required]],
    idNumber: ['', [Validators.required]],
    licenceNumber: ['', [Validators.required]],
    creditCard: ['', [Validators.required]],
    cvv: ['', [Validators.required]],
    expiryDate: ['', [Validators.required]],
    creditCardHolder: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private userService: AuthService,
    private customerService: Customerservice,
    private cookieService: CookieService,
    private toast: ToastService,
    private router: Router
  ) {}
  file: any;
  ionViewDidEnter() {
    this.getUser();

    this.populateMonthYears();
  }

  getFile(event: any, name: string) {
    this.file = event.target.files[0];
    // this.payload.set(name, this.file);
  }

  validateInput(inputValue: any | null) {
    const sanitizedValue = inputValue ?? ''.replace(/[^0-9]/g, ''); // Remove any non-numeric characters
    if (sanitizedValue.length > 12) {
      this.profileForm.controls.creditCard.setErrors({ maxLength: true }); // Set custom error for maximum length exceeded
    } else {
      this.profileForm.controls.creditCard.setValue(sanitizedValue); // Update the input value with the sanitized value
      this.profileForm.controls.creditCard.setErrors(null); // Clear any previous errors
    }
  }

  populateMonthYears() {
    const currentYear = new Date().getFullYear();
    const maxYear = currentYear + 10; // Adjust the maximum year as needed
    for (let year = currentYear; year <= maxYear; year++) {
      for (let month = 1; month <= 12; month++) {
        const monthYear = this.getMonthYearString(month, year);
        this.monthYears.push({
          val:
            year.toString().substring(2) +
            '' +
            month.toString().padStart(2, '0'), // this.formatDate(monthYear),
          label: monthYear,
        });
      }
    }
  }

  getMonthYearString(month: number, year: number): string {
    const monthStr = month.toString().padStart(2, '0');
    return `${monthStr} ${year}`;
  }

  getUser() {
    var user = JSON.parse(atob(this.cookieService.get('avis-user')));

    const emailAddress = user.emailAddress;

    this.userService.getUserByEmail(emailAddress).subscribe((user: any) => {
      this.customerId = user.customerId;

      this.user = user;
      if (user.customerId) {
        this.getCustomer(user);
      } else {
        this.profileForm.setValue({
          title: '',
          firstname: user.firstName,
          surname: user.lastName,
          cellPhone: user.contactNumber,
          billingAddressLine1: '',
          billingAddressLine2: '',
          email: user.emailAddress,
          dateOfBirth: '',
          idNumber: '',
          licenceNumber: '',
          creditCard: '',
          cvv: '',
          expiryDate: '',
          creditCardHolder: '',
        });
        this.toastService.showToast(
          'Please complete your profile in order to make a booking.'
        );

        this.ccHolder = `${user.firstName} ${user.lastName}`;
      }
    });

    console.log('userhere', this.loggedInUser);
  }

  updateProfile() {
    const _user = this.cookieService.get('avis-user');

    const res = JSON.parse(atob(_user));

    const values = this.profileForm.value;

    const payload = {
      title: values.title,
      custId: res?.customerId ?? '0',
      CustomerId: res?.customerId ?? '0',
      custIdPassport: values.idNumber,
      custFullNames: values.firstname,
      custSurname: values.surname,
      cellphone: values.cellPhone,
      email: values.email,
      driversLicense: values.licenceNumber,
      creditCardNumber: values.creditCard,
      dateOfBirth: values.dateOfBirth,
      creditCardExpiry: values.expiryDate,
      creditCardType: 'CM',
      vatReg: '',
      wizardNumber: '',
      contactPerson: `${values.firstname} ${values.surname}`,
      // luxClubNumber: "",
      // wizardNumber: "",
      // contactPerson: "",
      landline: '',
      billAddress1: values.billingAddressLine1,
      billAddress2: values.billingAddressLine2,
      // mobileIntDial:"",
      // frequentFlier: "",
      // roseNumber: "",
      custEmployer: '',
      licPpnNumber: values.licenceNumber,
    } as ICustomer;
    return;
    this.customerService.updateCustomer(payload).subscribe({
      next: (customer: any) => {
        if (customer.customerId != null && customer.customerId != '') {
          this.toastService.showToast(
            'Your details have been updated succesfully.'
          );

          var user = JSON.parse(atob(this.cookieService.get('avis-user')));
          user.customerId = customer.customerId;

          this.cookieService.delete('avis-user');

          this.cookieService.set(
            'avis-user',
            btoa(
              JSON.stringify({
                ...user,
                customerId: customer.customerId,
              })
            )
          );
        }
      },
      error: (err) => {
        this.toastService.showToast(
          err.error.charAt(0).toUpperCase() + err.error.slice(1)
        );
      },
    });
  }

  getDate() {
    var date = this.profileForm.controls.dateOfBirth.value;

    const p = moment(date).toDate();
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

  formatDate(date: any) {
    const result = date.replace(' ', '').substring(4, 6) + date.substring(0, 2);

    return `1${result}01`;
  }
  getCustomer(user: any) {
    this.customerService.getCustomer(user.customerId).subscribe({
      next: (_customer: any) => {
        this.profileForm.setValue({
          title: _customer.customerTitles ?? '',
          firstname: user.firstName,
          surname: user.lastName,
          cellPhone: user.contactNumber,
          billingAddressLine1: _customer?.billAddress1 ?? '',
          billingAddressLine2: _customer?.billAddress2 ?? '',
          email: user.emailAddress,
          dateOfBirth: _customer?.dateOfBirth ?? '',
          idNumber: _customer?.customerIdPassport ?? '',
          licenceNumber: _customer?.licPpnNumber ?? '',
          creditCard: _customer?.creditCardNumber ?? '',
          cvv: '',
          expiryDate: _customer?.creditCardExpiry?.substring(1, 5) ?? '',
          creditCardHolder: _customer?.creditCardHolder ?? '',
        });
        this.customer = _customer as ICustomer;
        this.ccHolder = `${user.firstName} ${user.lastName}`;
      },
      error: (err) => {
        console.log('error', err);
        this.toastService.showToast(
          'An error occured while retrieving your profile'
        );
      },
    });
  }
  deleteProfile() {
    var user = JSON.parse(atob(this.cookieService.get('avis-user')));

    this.customerService.deleteProfile(user).subscribe({
      next: (customer: any) => {
        this.cookieService.delete('avis-user');
        this.toastService.showToast(
          'Your profile has been deleted succesfully'
        );
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.toastService.showToast(
          'Error deleting your profile. Please try again later.'
        );
      },
    });
  }

  //   dateTimeUpdated(event:any){
  //
  //     console.log(event.detail.value);
  //     const selectedDate = new Date(event.detail.value);
  //     const diff = selectedDate.setFullYear(selectedDate.getFullYear() + 25);
  //     if (diff > new Date().getTime()) {
  //       this.toast.showToast(
  //         'Kindly note: The minimum age for Avis Luxury Car Rentals is 25 years and above. Renters be-tween 21 & 25 will be at managers discretion and a young driver’s surcharge will apply.',
  //         3000
  //       );
  //     }
  //   }
  checkDOb(event: any) {
    console.log(event.detail.value);
    const selectedDate = new Date(event.detail.value);
    this.profileForm.controls.dateOfBirth.setValue(event.detail.value);

    const diff = selectedDate.setFullYear(selectedDate.getFullYear() + 25);
    if (diff > new Date().getTime()) {
      this.toast.showToast(
        'Kindly note: The minimum age for Avis Luxury Car Rentals is 25 years and above. Renters be-tween 21 & 25 will be at managers discretion and a young driver’s surcharge will apply.',
        3000
      );
    }
    // this.driverBob = event.detail.value;
    // this.checkValid();
  }

  addProfile() {
    const payload = {};
  }
  //   this.customerService.addCustomer(payload).subscribe({

  //     next: (customer: any) => {

  //      const newCustomer =  {

  //         title: "Mr.",
  //         custId: "2123",
  //         custIdPassport: "Bk099812",
  //         custFullNames: "Dev-WPS",
  //         custSurname: "Kimani",
  //         cellphone: "0825078903",
  //         email: "njinu4@indigovision.co.za",
  //         driversLicense: "1122334455",
  //         creditCardNumber: "5192340568799908",
  //         creditCardExpiry: "0624",
  //         creditCardType: "CC",
  //         vatReg: "2347",
  //         luxClubNumber: "4343",
  //         wizardNumber: "3232",
  //         contactPerson: "3434",
  //         landline: "3433",
  //         billAddress1: "5 Sunset Ridge",
  //         billAddress2: "Johannesburg",
  //         mobileIntDial: "+27",
  //         frequentFlier: "3232",
  //         roseNumber: "43",
  //         custEmployer: "Indigo Vision",
  //         licPpnNumber: "4343"
  //         }
  //       }
  //       // this.LicPpnNumber = customer.licPpnNumber;

  //       // let _booking: any;
  //   // if (this.booking) {
  //   //   _booking = {
  //   //     ...this.booking,
  //   //     customer:newCustomer
  //   //   };
  //   // } else {
  //   //   _booking = {
  //   //     customer:newCustomer
  //   //   };
  //   // }

  //   // this.store.dispatch(addBooking({ booking: _booking }));
  //   // this.isWizardNumberSelect = true;
  //   //     this.dialogService.openAlertDialog({
  //   //       message: 'Customer succesfully added',
  //   //       okText: 'Ok',
  //   //       title: 'Success',
  //   //     })
  //   //     console.log("REREERER", customer)
  //   //     this.dialogRef.close(customer);
  //     },
  //     error: (err) =>{
  //     console.log("Error", err)
  //     }
  //     //   this.dialogService.openAlertDialog({
  //     //     message: 'Could not add customer',
  //     //     okText: 'Ok',
  //     //     title: 'Error adding customer',
  //     //   })
  //     // })
  // }
}
