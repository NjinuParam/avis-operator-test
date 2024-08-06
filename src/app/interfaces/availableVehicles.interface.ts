import { IVehicle } from './vehicle.interface';

export interface IAvailableVehicles {
  serviceTypeCode: string;
  vehicles?: IVehicle[];
}
