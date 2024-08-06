import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BottomMenuPage } from 'src/app/shared/bottom-menu/bottom-menu.page';
import { LocationService } from 'src/app/services/location.service';
import { Geolocation } from '@capacitor/geolocation';
import { Location } from '@angular/common'
@Component({
  selector: 'app-emergency',
  templateUrl: './emergency.page.html',
  styleUrls: ['./emergency.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BottomMenuPage],
})
export class EmergencyPage implements OnInit {
  constructor(private locationService: LocationService, private location: Location) {}

  ngOnInit(): void {
    
  }
  ionViewDidEnter() {
    this.getSupportNumber();
  }
  back(){
    this.location.back()
  }
  public alertButtons = ['OK'];
  contactNumbers: any;
  async getSupportNumber() {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });
    this.locationService
      .getContactNumber(
        coordinates.coords.latitude,
        coordinates.coords.longitude
      )
      .subscribe((result) => (this.contactNumbers = result));
  }
}
