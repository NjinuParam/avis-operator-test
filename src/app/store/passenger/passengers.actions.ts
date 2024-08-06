import { createAction, props } from '@ngrx/store';
import { Passenger } from 'src/app/interfaces/passenger.interface';


export const addPassenger = createAction(
    '[Passenger] Add Passenger',
     props<{ passenger: Passenger }>()
    );


