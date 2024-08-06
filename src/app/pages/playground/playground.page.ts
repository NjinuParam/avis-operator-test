import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Route, Router } from '@angular/router';
import { BottomMenuPage } from "../../shared/bottom-menu/bottom-menu.page";

@Component({
    selector: 'app-playground',
    templateUrl: './playground.page.html',
    styleUrls: ['./playground.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, BottomMenuPage]
})
export class PlaygroundPage implements OnInit {
  constructor(private router: Router) {}

  ionViewDidEnter() {}
  gotTo(route: string) {
    this.router.navigate([route]);
  }
}
