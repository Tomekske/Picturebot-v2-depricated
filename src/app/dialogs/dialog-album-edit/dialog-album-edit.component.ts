import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment';

@Component({
  selector: 'app-dialog-album-edit',
  templateUrl: './dialog-album-edit.component.html',
  styleUrls: ['./dialog-album-edit.component.css']
})
export class DialogAlbumEditComponent implements OnInit {
  name: string;
  date: Date;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogAlbumEditComponent>) { }

  /**
   * On init lifecycle hook
   */
  ngOnInit(): void {
    // Set default values
    this.name = this.data.album.name;
    this.date = moment(this.data.album.date, "DD/MM/YYYY").toDate();
  }
  
  /**
   * Close the dialog button
   */
  cancelClick() {
    this.dialogRef.close();
  }
}
