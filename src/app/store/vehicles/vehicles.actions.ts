import { createAction, props } from '@ngrx/store';
import { IAvailableVehicles } from 'src/app/interfaces/availableVehicles.interface';
import { IVehicle } from 'src/app/interfaces/vehicle.interface';

export enum VehicleActionTypes {
  ADD_VEHICLE = '[Vehicle] ADD_VEHICLE',
  REMOVE_VEHICLE = '[Vehicle] REMOVE_VEHICLE',
  LOAD_VEHICLES = '[Vehicle] LOAD_VEHICLES',
  LOAD_VEHICLES_SUCCESS = '[Vehicle] LOAD_VEHICLES_SUCCESS',
  LOAD_VEHICLES_FAILURE = '[Vehicle] LOAD_VEHICLES_FAILURE',
}

export const addVehicle = createAction(
  VehicleActionTypes.ADD_VEHICLE,
  props<{ vehicle: IVehicle }>()
);

export const removeVehicle = createAction(
  VehicleActionTypes.REMOVE_VEHICLE,
  props<{ id: string }>()
);

export const loadVehicles = createAction(
  VehicleActionTypes.LOAD_VEHICLES,
  props<{ requestPayload: any }>()
);

export const loadVehiclesSuccess = createAction(
  VehicleActionTypes.LOAD_VEHICLES_SUCCESS,
  props<{ vehicles: any[] }>()
);

export const loadVehiclesFailure = createAction(
  VehicleActionTypes.LOAD_VEHICLES_FAILURE,
  props<{ error: string }>()
);
