import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-album-delete',
  templateUrl: './dialog-album-delete.component.html',
  styleUrls: ['./dialog-album-delete.component.css']
})
export class DialogAlbumDeleteComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogAlbumDeleteComponent>) { }

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
