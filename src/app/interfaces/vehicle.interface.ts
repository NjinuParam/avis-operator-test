import { IFeeBreakdown } from './feeBreakdown.interface';
import { IVehicleExtras } from './vehicleExtras.interface';

export interface IVehicle {
  code: string;
  description: string;
  doors: string;
  maxPassengers: number | null;
  fee: {
    priceUnit: string;
    price: string;
    feeType: string;
    calculatedDistance: string;
    calculatedTime: string;
  };
  isAvailable: boolean | null;
  feeBreakdown: { fee: IFeeBreakdown[] };
  suitCases: number | null;
  fuelType: string | null;
  transmissionType: string | null;
  image?: string | null;
  driverAgeCondition?: string;
  vehicleExtras: IVehicleExtras[] | null;
  serviceTypeCode: string;
}
