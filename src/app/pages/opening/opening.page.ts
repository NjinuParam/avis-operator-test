import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BottomMenuPage } from 'src/app/shared/bottom-menu/bottom-menu.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-opening',
  templateUrl: './opening.page.html',
  styleUrls: ['./opening.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BottomMenuPage,
  ],
})
export class OpeningPage {
  constructor(private router: Router) {}
  register() {
    this.router.navigate(['register']);
  }

  login() {
    this.router.navigate(['login']);
  }
}

export class OpeningPageModule {}
