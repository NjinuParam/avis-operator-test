import { createAction, props } from '@ngrx/store';
import { Drivers } from 'src/app/interfaces/drivers.interface';


export const setDrivers = createAction(
  '[Drivers] Set Drivers', props<{ drivers: Drivers }>()
  );

  