import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { BookingService } from 'src/app/services/booking.service';
import {
  loadVehicles,
  loadVehiclesFailure,
  loadVehiclesSuccess,
} from './vehicles.actions';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';

@Injectable()
export class VehicleEffects {
  loadVehicles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadVehicles),
      exhaustMap((payload) =>
        this.bookingService.getVehicleRates(payload).pipe(
          map((response: any) => {
            if (response?.availableVehicles?.length > 0) {
              this.router.navigate(['available-vehicles']);
            }

            
            const modifiedData = response?.availableVehicles.map((item:any) => {
              const serviceType = item.serviceTypeCode;
              const vehiclesWithServiceType = item.vehicles.map((vehicle:any) => ({
                  ...vehicle,
                  serviceType
              }));
              return { ...item, vehicles: vehiclesWithServiceType };
          });
          
          console.log(modifiedData);


            return loadVehiclesSuccess({
              vehicles: modifiedData,
            });
          }),
          tap(async (response: any) => {
            if (response?.vehicles?.length == 0) {
              this.toast.showToast('No vehicles found');
            }
          }),
          catchError(async (error) => {
            console.log(error);
            this.toast.showToast('Could search for available vehicles');
            return loadVehiclesFailure({ error: 'Failed to load vehicles' });
          })
        )
      )
    )
  );
  constructor(
    private actions$: Actions,
    private bookingService: BookingService,
    private router: Router,
    private toast: ToastService
  ) {}
}
