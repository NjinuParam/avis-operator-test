import { createReducer, on } from '@ngrx/store';
import { IAvailableVehicles } from 'src/app/interfaces/availableVehicles.interface';
import { IVehicle } from 'src/app/interfaces/vehicle.interface';
import { availableVehicles } from 'src/app/sampleData/availableVehicles';
import {
  addVehicle,
  removeVehicle,
  loadVehicles,
  loadVehiclesSuccess,
  loadVehiclesFailure,
} from './vehicles.actions';

export interface VehiclesState {
  currentVehicle: IVehicle | null;
  availableVehicles: any | null;
  error: string | null;
  status: 'pending' | 'loading' | 'error' | 'success';
}

export const initialState: VehiclesState = {
  currentVehicle: null,
  error: null,
  status: 'pending',
  availableVehicles: null,
};

export const vehiclesReducer = createReducer(
  initialState,
  on(addVehicle, (state, { vehicle }) => ({
    ...state,
    currentVehicle: vehicle,
  })),
  on(loadVehicles, (state) => ({
    ...state,
    status: 'loading',
  })),
  on(loadVehiclesSuccess, (state, { vehicles }) => ({
    ...state,
    availableVehicles: vehicles,
  }))
);
