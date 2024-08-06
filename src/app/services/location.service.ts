import { Injectable } from '@angular/core';
import { getDatabase, onValue, ref, set } from '@angular/fire/database';
import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';
import { FirebaseApp } from '@angular/fire/app';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private fApp: FirebaseApp, private httpClient: HttpClient) {}
  setCustomerPosition(lat: number, lng: number, bookingRef: string) {
    const db = getDatabase(this.fApp);
    const dbRef = ref(db, `bookings/${bookingRef}/customer`);
    set(dbRef, { lat, lng });
  }
  trackDriver(bookingRef: string) {
    return new Observable((observer) => {
      const db = getDatabase(this.fApp);
      const dbRef = ref(db, `/bookings/${bookingRef}/driver`);
      onValue(dbRef, (snapshot) => {
        observer.next(snapshot.val());
      });
    });
  }
  getContactNumber(xCoodinate: number, yCoodinate: number) {
    return this.httpClient.get(
      `${environment.baseUrl}${environment.api.airports}/${xCoodinate}/${yCoodinate}`
    );
  }
}
