import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-picture-delete',
  templateUrl: './dialog-picture-delete.component.html',
  styleUrls: ['./dialog-picture-delete.component.css']
})
export class DialogPictureDeleteComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogPictureDeleteComponent>) { }

  /**
   * On init lifecycle hook
   */
  ngOnInit(): void { }

  /**
   * Close the dialog
   */
  cancelClick() {
    this.dialogRef.close();
  }
}
