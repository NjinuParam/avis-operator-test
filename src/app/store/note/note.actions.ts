import { createAction, props } from '@ngrx/store';
import { Note } from 'src/app/interfaces/note.interface';

export const addNote = createAction('[Note] Add Note', props<{ note: Note }>());
export const noteBackUrl = createAction(
  '[Note] Note Back URL',
  props<{ url: string }>()
);
