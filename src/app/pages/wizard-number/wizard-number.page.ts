import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-wizard-number',
  templateUrl: './wizard-number.page.html',
  styleUrls: ['./wizard-number.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class WizardNumberPage implements OnInit {
  constructor() {}

  ngOnInit() {}
  onContinue() {}
}
