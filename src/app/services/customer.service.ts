import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IAirport } from '../interfaces/airport.interface';
import { FirebaseApp } from '@angular/fire/app';

@Injectable({
  providedIn: 'root',
})
export class Customerservice {
  getFrequentlyUsedDrivers(customerId: string) {
    return this.http.get(
      `${this.baseUrl}${environment.api.getFrequentDrivers}${customerId}`
    );
  }
  getFrequentlyUsedAddresses(customerId: string) {
    return this.http.get(
      `${this.baseUrl}${environment.api.getFrequentAddresses}${customerId}`
    );
  }
  deleteProfile(customer: any) {
    return this.http.put(
      this.baseUrl + 'User/customers/deactivate/' + customer?.emailAddress,
      {
        id: customer.id,
      }
    );
  }
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient, private fApp: FirebaseApp) {}

  updateCustomer(payload: any) {
    return this.http.post(
      this.baseUrl + 'customer/updatecustomerprofile',
      payload
    );
  }

  updateCustomerCard(payload: any) {
    return this.http.post(
      this.baseUrl + 'customer/updatecustomercard',
      payload
    );
  }
  addCustomer(payload: any) {
    return this.http.post(this.baseUrl + environment.api.customer, payload);
  }

  getCustomer(id: any) {
    return this.http.get(
      `${this.baseUrl + environment.api.customer}/cust/${id}`
    );
  }
}
