import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ViewDidEnter } from '@ionic/angular';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { BookingService } from 'src/app/services/booking.service';
import { Geolocation } from '@capacitor/geolocation';
import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';
import { LocationService } from 'src/app/services/location.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

declare var google: any;

@Component({
  selector: 'app-vehicle-tracker',
  templateUrl: './vehicle-tracker.page.html',
  styleUrls: ['./vehicle-tracker.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VehicleTrackerPage implements ViewDidEnter {
  @ViewChild('map') mapRef: ElementRef | undefined;
  map!: google.maps.Map;
  lat: number | undefined;
  lng: number | undefined;
  driverMarker!: google.maps.Marker; //  = { coordinate: { lat: 0, lng: 0 } };
  customerMarker!: google.maps.Marker;
  markers: google.maps.Marker[] = [];
  driverMarkerOnMap = false;
  bounds = new google.maps.LatLngBounds();
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  driverPosition: google.maps.LatLng | undefined;
  customerPosition: google.maps.LatLng | undefined;
  bookingReference:string="";
  booking:any;
  vehicleImage:string="";
  bookingLeg:string="";
  currentLeg:any;

  @ViewChild('addresstext') addresstext: any;

  constructor(private locationService: LocationService, private router:Router,
    private activatedRoute: ActivatedRoute,  private bookingService: BookingService ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.bookingReference = params['bookingNumber'];
      this.bookingLeg = params['bookingLeg'];
    });

  }
  ionViewWillEnter(): void {
    this.createMap();
  }

  toFriendlyDate(date:string){
    return moment(date).fromNow();
  }

  bookingSummary()
  {
    this.router.navigateByUrl(`/booking-summary/${this.bookingReference}`);
  }
  emergency(){
    this.router.navigateByUrl(`/emergency`);
  }

  ionViewDidEnter() {
    this.bookingService
      .getBookingsByBookingId(this.bookingReference)
      .subscribe((response:any) => {
        console.log(response);
        this.booking = response;
       
        this.currentLeg = response.getBookingResult.legs.leg[this.bookingLeg];
       this.vehicleImage =  response.getBookingResult.legs.leg[this.bookingLeg].vehicleImage.storageUrl

      });
  }

  async setDriversPosition(coords: LatLng) {
    if (coords) {
      let marker!: google.maps.Marker;
      if (this.markers.length <= 1) {
        marker = new google.maps.Marker({
          position: coords,
          map: this.map,
          title: 'Driver',
        });
        this.markers.push(marker);
        this.markers[1].setMap(this.map);
      } else {
        this.markers[1].setPosition(coords);
      }
      this.driverPosition = new google.maps.LatLng(coords.lat, coords.lng);
      this.bounds.extend(coords);
      this.map.fitBounds(this.bounds);
      this.calcRoute();
    }
  }

  async setCustomerPosition(coords: LatLng) {
    if (coords) {
      if (!this.customerMarker) {
        const marker = new google.maps.Marker({
          position: coords,
          map: this.map,
          title: 'You',
        });
        this.markers.push(marker);
        this.markers[0].setMap(this.map);
        this.bounds.extend(coords);
        this.customerPosition = new google.maps.LatLng(coords.lat, coords.lng);
      }
    }
  }
  calcRoute() {
    let request = {
      origin: this.driverPosition,
      destination: this.customerPosition,
      // Note that JavaScript allows us to access the constant
      // using square brackets and a string value as its
      // "property."
      travelMode: google.maps.TravelMode['DRIVING'],
    };
    const _this = this;
    this.directionsService.route(
      request,
      function (response: any, status: string) {
        if (status == 'OK') {
          _this.directionsRenderer.setDirections(response);
        }
      }
    );
  }
  async createMap() {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });
    // this.map = await GoogleMap.create({
    //   id: 'my-map',
    //   element: this.mapRef?.nativeElement,
    //   apiKey: environment.mapsKey,
    //   config: {
    //     center: {
    //       lat: coordinates.coords.latitude,
    //       lng: coordinates.coords.longitude,
    //     },
    //     zoom: 14,
    //   },
    // });
    // this.map.enableClustering(2);
    let mapProp = {
      center: new google.maps.LatLng(
        coordinates.coords.latitude,
        coordinates.coords.longitude
      ),
      zoom: 12,
    };

    this.map = new google.maps.Map(
      document.getElementById('googleMap'),
      mapProp
    );
    this.setCustomerPosition({
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude,
    });
    this.locationService.setCustomerPosition(
      coordinates.coords.latitude,
      coordinates.coords.longitude,
      this.bookingReference
    );
    this.locationService
      .trackDriver(this.bookingReference)
      .subscribe(async (data: any) => {
        if (data) {
          this.setDriversPosition(data);
        } else {
          if (this.driverMarkerOnMap) {
            this.markers[1].setMap(null);
            this.markers.pop();
            this.driverMarkerOnMap = false;
          }
        }
        // consol.driverMarkerId
      });
    this.locationService.setCustomerPosition(
      coordinates.coords.latitude,
      coordinates.coords.longitude,
      this.bookingReference
    );
    this.directionsRenderer.setMap(this.map);
  }
}
