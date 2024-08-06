import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Note } from 'src/app/interfaces/note.interface';
import { addNote } from 'src/app/store/note/note.actions';
import { BottomMenuPage } from '../../shared/bottom-menu/bottom-menu.page';
import { addBooking } from 'src/app/store/bookings/bookings.actions';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.page.html',
  styleUrls: ['./add-note.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BottomMenuPage,
  ],
})
export class AddNotePage implements OnDestroy {
  additionalNote = this.fb.group({
    note: [''],
  });
  booking: any;
  subscription: Subscription | undefined;
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private location: Location
  ) {
    this.subscription = this.store
      .select((store: any) => store.bookings)
      .subscribe((res) => {
        this.booking = res.selectedBooking;
        if (this.booking?.note) {
          this.additionalNote.controls['note'].setValue(this.booking.note);
        }
      });
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onBack() {
    this.router.navigateByUrl(this.booking.backUrl);
  }

  addNote() {
    const updatedBooking = {
      ...this.booking,
      note: this.additionalNote.value.note,
    };
    this.store.dispatch(addBooking({ booking: updatedBooking }));
    this.router.navigateByUrl('/generate-quote');
  }
}
