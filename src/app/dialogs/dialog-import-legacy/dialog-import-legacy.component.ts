import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollection, ILibrary } from '../../../../shared/database/interfaces';
import { IpcFrontend } from '../../../../shared/ipc/frontend';

@Component({
  selector: 'app-dialog-import-legacy',
  templateUrl: './dialog-import-legacy.component.html',
  styleUrls: ['./dialog-import-legacy.component.css']
})
export class DialogImportLegacyComponent implements OnInit {
  collectionForm: FormGroup;
  collections: any = [];

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<DialogImportLegacyComponent>) { }

  ngOnInit(): void {
    IpcFrontend.getCollections().forEach((collection: ICollection) => {
      this.collections.push(collection.collection);
    });

    let defaultCollection: string = (this.collections.length == 0) ? "" : this.collections[0];

    this.collectionForm = this.fb.group({
      collection: defaultCollection,
      legacy: [''],
      backup: ['Backup'],
      base: ['RAW'],
      preview: ['Preview'],
      edited: ['Edited'],
      socialMedia: ['Instagram'],
      favorites: ['Selection']
    });

  }

  /**
   * Close the dialog
   */
  cancelClick() {
    this.dialogRef.close();
  }

  /**
   * Clear the input value of an control element
   * @param control Control element name
   */
  clearInput(control: string) {
    this.collectionForm.controls[control].reset();
  }
}
