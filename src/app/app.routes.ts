import { Routes } from '@angular/router';
import { BottomMenuPage } from './shared/bottom-menu/bottom-menu.page';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/opening/opening.page').then((m) => m.OpeningPage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.page').then(
        (m) => m.ForgotPasswordPage
      ),
  },
  {
    path: 'otp',
    loadComponent: () => import('./pages/otp/otp.page').then((m) => m.OtpPage),
  },
  {
    path: 'bookings',
    loadComponent: () =>
      import('./pages/bookings/bookings.page').then((m) => m.BookingsPage),
  },
  {
    path: 'wizard-number',
    loadComponent: () =>
      import('./pages/wizard-number/wizard-number.page').then(
        (m) => m.WizardNumberPage
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password.page').then(
        (m) => m.ResetPasswordPage
      ),
  },
  {
    path: 'conditions',
    loadComponent: () =>
      import('./pages/conditions/conditions.page').then(
        (m) => m.ConditionsPage
      ),
  },
  {
    path: 'add-note',
    loadComponent: () =>
      import('./pages/add-note/add-note.page').then((m) => m.AddNotePage),
  },
  {
    path: 'credit-card',
    loadComponent: () =>
      import('./pages/credit-card/credit-card.page').then(
        (m) => m.CreditCardPage
      ),
  },

  {
    path: 'available-booking-types',
    loadComponent: () =>
      import(
        './pages/available-booking-types/available-booking-types.page'
      ).then((m) => m.AvailableBookingTypesPage),
  },
  {
    path: 'available-booking-types/:edit',
    loadComponent: () =>
      import(
        './pages/available-booking-types/available-booking-types.page'
      ).then((m) => m.AvailableBookingTypesPage),
  },

  {
    path: 'vehicle-finder',
    loadComponent: () =>
      import('./pages/vehicle-finder/vehicle-finder.page').then(
        (m) => m.VehicleFinderPage
      ),
  },
  {
    path: 'booking-summary/:bookingNumber',
    loadComponent: () =>
      import('./pages/booking-summary/booking-summary.page').then(
        (m) => m.BookingSummaryPage
      ),
  },
  {
    path: 'booking-summary',
    loadComponent: () =>
      import('./pages/booking-summary/booking-summary.page').then(
        (m) => m.BookingSummaryPage
      ),
  },
  {
    path: 'vehicle-track',
    loadComponent: () =>
      import('./pages/vehicle-tracker/vehicle-tracker.page').then(
        (m) => m.VehicleTrackerPage
      ),
  },
  {
    path: 'available-vehicles',
    loadComponent: () =>
      import('./pages/available-vehicles/available-vehicles.page').then(
        (m) => m.AvailableVehiclesPage
      ),
  },
  {
    path: 'vehicle-details',
    loadComponent: () =>
      import('./pages/vehicle-details/vehicle-details.page').then(
        (m) => m.VehicleDetailsPage
      ),
  },
  {
    path: 'emergency',
    loadComponent: () =>
      import('./pages/emergency/emergency.page').then((m) => m.EmergencyPage),
  },
  {
    path: 'additional-drivers',
    loadComponent: () =>
      import('./pages/additional-drivers/additional-drivers.page').then(
        (m) => m.AdditionalDriversPage
      ),
  },
  {
    path: 'main-passenger',
    loadComponent: () =>
      import('./pages/main-passenger/main-passenger.page').then(
        (m) => m.MainPassengerPage
      ),
  },
  {
    path: 'bottom-menu',
    loadComponent: () =>
      import('./shared/bottom-menu/bottom-menu.page').then(
        (m) => m.BottomMenuPage
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password.page').then(
        (m) => m.ResetPasswordPage
      ),
  },
  {
    path: 'available-booking-types',
    loadComponent: () =>
      import(
        './pages/available-booking-types/available-booking-types.page'
      ).then((m) => m.AvailableBookingTypesPage),
  },
  {
    path: 'vehicle-finder',
    loadComponent: () =>
      import('./pages/vehicle-finder/vehicle-finder.page').then(
        (m) => m.VehicleFinderPage
      ),
  },
  {
    path: 'available-vehicles',
    loadComponent: () =>
      import('./pages/available-vehicles/available-vehicles.page').then(
        (m) => m.AvailableVehiclesPage
      ),
  },
  {
    path: 'vehicle-details',
    loadComponent: () =>
      import('./pages/vehicle-details/vehicle-details.page').then(
        (m) => m.VehicleDetailsPage
      ),
  },
  {
    path: 'vehicle-tracker',
    loadComponent: () =>
      import('./pages/vehicle-tracker/vehicle-tracker.page').then(
        (m) => m.VehicleTrackerPage
      ),
  },
  {
    path: 'generate-quote',
    loadComponent: () =>
      import('./pages/generate-quote/generate-quote.page').then(
        (m) => m.GenerateQuotePage
      ),
  },
  {
    path: 'terms-conditions',
    loadComponent: () =>
      import('./pages/conditions/conditions.page').then(
        (m) => m.ConditionsPage
      ),
  },
  {
    path: 'review-quote',
    loadComponent: () =>
      import('./pages/review-quote/review-quote.page').then(
        (m) => m.ReviewQuotePage
      ),
  },
  {
    path: 'quote-summary/:quoteNumber',
    loadComponent: () =>
      import('./pages/quote-summary/quote-summary.page').then(
        (m) => m.QuoteSummaryPage
      ),
  },
  {
    path: 'rental-summary',
    loadComponent: () =>
      import('./pages/rental-summary/rental-summary.page').then(
        (m) => m.RentalSummary
      ),
  },
  {
    path: 'enquiry/:bookingNumber/:leg',
    loadComponent: () =>
      import('./pages/enquiry/enquiry.page').then((m) => m.EnquiryPage),
  },
  {
    path: 'pdf',
    loadComponent: () =>
      import('./pages/pdf-viewer2/pdf-viewer2.page').then(
        (m) => m.PdfViewer2Page
      ),
  }
  // {
  //   path:'home',
  //   loadChildren: () => import('./pages/login/login.page').then((m) => m.LoginPage),

  // },
  // {
  //   path: '',
  //   component: BottomMenuPage,
  //   children: [
  //     {
  //       path:'home',
  //       loadChildren: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  //     }
  //   ]
  // }
];
