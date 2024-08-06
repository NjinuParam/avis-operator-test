import { CommonModule } from '@angular/common';
import {
  Component,
  ViewChild,
  EventEmitter,
  Output,
  AfterViewInit,
  Input,
  NgZone,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

declare var google: any;
@Component({
  selector: 'app-address-autocomplete',
  templateUrl: './address-autocomplete.component.html',
  standalone: true,
  styleUrls: ['./address-autocomplete.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class AddressAutocompleteComponent implements AfterViewInit {
  @Input() addressType: string = '';
  @Input() label: string = '';
  @Input() latLng: { lat: number; lng: number } | undefined;
  @Input() address: string = '';
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') addresstext: any;

  lat!: string;
  long!: string;
  autocomplete: { input: string } = { input: '' };
  autocompleteItems!: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  message: string = '';

  constructor(public zone: NgZone) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }

  autocompleteInput: string = '';
  queryWait: boolean = false;
  ngAfterViewInit(): void {
    // this.getPlaceAutocomplete();

    if (this.latLng) {
      this.setAddressFromLatLng(this.latLng);
    }
    if (this.address) {
      this.autocomplete = { input: this.address };
    }
  }
  private getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(
      this.addresstext.nativeElement,
      {
        componentRestrictions: { country: 'ZA' },
        types: [], // 'establishment' / 'address' / 'geocode'
      }
    );
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.invokeEvent(place);
    });
  }

  invokeEvent(place: Object) {
    this.setAddress.emit(place);
  }

  UpdateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions(
      {
        input: this.autocomplete.input,
        componentRestrictions: { country: 'ZA' },
        types: [],
      },
      (predictions: any[], status: any) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      }
    );
  }
  setAddressFromLatLng(latLng: { lat: number; lng: number }) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results: any) => {
      console.log(results);
    });
  }
  SelectSearchResult(item: any) {
    ///WE CAN CONFIGURE MORE COMPLEX FUNCTIONS SUCH AS UPLOAD DATA TO FIRESTORE OR LINK IT TO SOMETHING

    console.log(JSON.stringify(item));
    this.autocomplete.input = item.description;
    this.placeid = item.place_id;
    const _this = this;
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode(
      { placeId: item.place_id },
      function (results: any, status: any) {
        if (status == google.maps.GeocoderStatus.OK) {
          var lat = results[0].geometry.location.lat();
          var lng = results[0].geometry.location.lng();
          let province = results[0].address_components.filter((x: any) =>
            x.types.includes('administrative_area_level_1')
          )[0]?.long_name;

          let streetNumber = results[0].address_components.filter((x: any) =>
            x.types.includes('street_number')
          )[0]?.long_name;

          let streetName = results[0].address_components.filter((x: any) =>
            x.types.includes('route')
          )[0]?.long_name;

          let town = results[0].address_components.filter((x: any) =>
            x.types.includes('locality')
          )[0]?.long_name;

          let suburb = results[0].address_components.filter((x: any) =>
            x.types.includes('sublocality')
          )[0]?.long_name;
          streetName = streetName ? streetName : suburb ? suburb : town;
          suburb = suburb ? suburb : town;
          let streetBuildingName = streetName;
          let error = streetNumber
            ? ''
            : 'Please Specify the street number<br />';
          error += streetName ? '' : 'Please Specify the street name<br />';
          error += suburb ? '' : 'Please Specify the suburb <br />';
          //_this.message = error;
          _this.setAddress.emit({
            ...item,
            lat,
            lng,
            province,
            streetNumber,
            streetName,
            town,
            suburb,
            streetBuildingName,
            error,
          });
        } else {
          // alert("Can't find address: " + status);
        }
      }
    );
    this.autocompleteItems = [];
  }
  ClearAutocomplete() {
    this.autocompleteItems = [];
    this.autocomplete.input = '';
  }
}
