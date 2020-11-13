import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-picture-info',
  templateUrl: './dialog-picture-info.component.html',
  styleUrls: ['./dialog-picture-info.component.css']
})
export class DialogPictureInfoComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  /**
   * On init lifecycle hook
   */
  ngOnInit(): void { }
}
