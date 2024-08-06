import { IDialogData } from './dialog-data.interface';

export interface IConfirmDialogData extends IDialogData {
  confirmText: string;
  cancelText: string;
}
