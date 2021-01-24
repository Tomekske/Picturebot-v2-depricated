import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElectronService } from '../../core/services/electron/electron.service';
import { ICollection, ILibrary } from '../../../../shared/database/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from 'app/services/data.service';
import { IpcFrontend } from '../../../../shared/ipc/frontend';
import { MenuText, Message, Regex } from '../../../../shared/helper/enums';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  collectionForm: FormGroup;
  libraries: any = [];
  message = Message;

  constructor(private electron: ElectronService, private fb: FormBuilder, private _snack: MatSnackBar, private _data: DataService, private _router: Router) { }

  /**
   * On init lifecycle hook
   */
  ngOnInit(): void {
    this._data.IsPictures = false;
    this._data.MenuText = MenuText.collection;
    
    IpcFrontend.getLibraries().forEach((library: ILibrary) => {
      this.libraries.push(library.library);
    });

    let defaultLibrary: string = (this.libraries.length == 0) ? "" : this.libraries[0];

    this.collectionForm = this.fb.group({
      library: defaultLibrary,
      name: ['', [Validators.required, Validators.pattern(Regex.NameNoWhiteSpaces)]],
      backup: ['Backup', [Validators.required, Validators.pattern(Regex.NameNoWhiteSpaces)]],
      base: ['Raw', [Validators.required, Validators.pattern(Regex.NameNoWhiteSpaces)]],
      preview: ['Preview', [Validators.required, Validators.pattern(Regex.NameNoWhiteSpaces)]],
      edited: ['Edited', [Validators.required, Validators.pattern(Regex.NameNoWhiteSpaces)]],
      socialMedia: ['Instagram', [Validators.required, Validators.pattern(Regex.NameNoWhiteSpaces)]],
      favorites: ['Favorites', [Validators.required, Validators.pattern(Regex.NameNoWhiteSpaces)]]
    });
  }

  /**
   * Method that simplifies getting the form controls 
   */
  get form() { 
    return this.collectionForm.controls; 
  }

  /**
   * Function to save a collection in the database
   */
  saveCollection() {
    let form: ICollection = this.collectionForm.value;
    let data: ICollection = {
      library: form.library, name: form.name, backup: form.backup, base: form.base,
      preview: form.preview, edited: form.edited, socialMedia: form.socialMedia,
      favorites: form.favorites, collection: this.electron.path.join(form.library, form.name)
    };

    // Return on validation errors
    if (this.collectionForm.invalid || this.libraries.length === 0) {
      this._snack.open(`Input values are invalid!`, "Dismiss", {
        duration: 4000,
        horizontalPosition: "end",
        panelClass: "snackbar-id"
      });
              
      return;
    }

    IpcFrontend.saveCollection(data);

    this._snack.open(`Collection saved!`, "Dismiss", {
      duration: 4000,
      horizontalPosition: "end",
      panelClass: "snackbar-id"
    });

    this._data.IsCollectionSaved = true;
    this._router.navigateByUrl('/main');
  }

  /**
   * Clear the input value of an control element
   * @param control Control element name
   */
  clearInput(control: string) {
    this.collectionForm.controls[control].reset();
  }
}
