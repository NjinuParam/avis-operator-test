import { enableProdMode, importProvidersFrom, isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { bookingTypesReducer } from './app/store/bookingTypes/bookingTypes.reducer';
import { bookingsReducer } from './app/store/bookings/bookings.reducer';
import { vehiclesReducer } from './app/store/vehicles/vehicles.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { EffectsModule } from '@ngrx/effects';
import { VehicleEffects } from './app/store/vehicles/vehicles.effects';
import { BookingEffects } from './app/store/bookings/bookings.effects';
import { HttpRequestInterceptor } from './app/services/HttpInterceptor';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    HttpClientModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },

    importProvidersFrom(HttpClientModule),
    importProvidersFrom(IonicModule.forRoot({})),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebase))
    ),
    importProvidersFrom(provideDatabase(() => getDatabase())),
    provideRouter(routes),
    importProvidersFrom(
      StoreModule.forRoot({
        vehicles: vehiclesReducer,
        bookings: bookingsReducer,
        bookingTypes: bookingTypesReducer,
      })
    ),
    importProvidersFrom(
      EffectsModule.forRoot([VehicleEffects, BookingEffects])
    ),
    importProvidersFrom(
      StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
    ),
  ],
});
defineCustomElements(window);
