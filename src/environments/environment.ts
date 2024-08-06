// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCeCe49eW9H81QpRE8YG5s-tjg6Q4MfKOc',
    authDomain: 'avis-project-81bba.firebaseapp.com',
    databaseURL: 'https://avis-project-81bba-default-rtdb.firebaseio.com',
    projectId: 'avis-project-81bba',
    storageBucket: 'avis-project-81bba.appspot.com',
    messagingSenderId: '932067447152',
    appId: '1:932067447152:web:77d29904bf94943c16bfb5',
    measurementId: 'G-Y75FTRPS8C',
  },
  mapsKey: 'AIzaSyA_pMgEY3hnhEpXOjOM7Kgtede5PE-K-7Y',
  // baseUrl: 'https://localhost:7003/',
  baseUrl: 'https://avis-dev.geekymedia.club/',
  api: {
    register: 'User/registercustomer',
    // getByEmail: 'User/getByEmail',
    login: 'User/login',
    resetPassword: 'User/password/reset/',
    airports: 'Airport',
    vehicleRates: 'Vehicles',
    customer: 'Customer',
    loadBookings: 'Booking/customer/',
    bookings: 'Booking',
    otp: 'Customer/otp/',
    socialLogin: 'User/socials/google',
    getFrequentDrivers: 'user/getFrequentDrivers/',
    getFrequentAddresses: 'user/getFrequentAddresses/',
  },
 
  metaData: {
    additionalDrivers: [
      {
        driver: 0,
        cost: 0,
      },
      {
        driver: 1,
        cost: 200,
      },
      {
        driver: 2,
        cost: 600,
      },
      {
        driver: 3,
        cost: 1000,
      },
      {
        driver: 4,
        cost: 1200,
      },
      {
        driver: 5,
        cost: 1600,
      },
    ],
    babySeats: [
      {
        seat: 0,
        cost: 0,
      },
      {
        seat: 1,
        cost: 200,
      },
      {
        seat: 2,
        cost: 600,
      },
      {
        seat: 3,
        cost: 1000,
      },
      {
        seat: 4,
        cost: 1200,
      },
      {
        seat: 5,
        cost: 1600,
      },
    ],
    gpsUnit: [
      { name: 'Yes', cost: 300 },
      { name: 'No', cost: 0 },
    ],
    luggageTransfer: [
      { name: 'Yes', cost: 600 },
      { name: 'No', cost: 0 },
    ],
    ipodConnectors: [
      {
        units: 0,
        cost: 0,
      },
      {
        units: 1,
        cost: 200,
      },
      {
        units: 2,
        cost: 600,
      },
      {
        units: 3,
        cost: 1000,
      },
      {
        units: 4,
        cost: 1200,
      },
      {
        units: 5,
        cost: 1600,
      },
    ],
    snugAndSafe: [
      { name: 'Yes', cost: 300 },
      { name: 'No', cost: 0 },
    ],
  },
};
