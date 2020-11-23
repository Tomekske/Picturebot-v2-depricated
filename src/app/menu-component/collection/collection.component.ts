import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElectronService } from '../../core/services/electron/electron.service';
import { ICollection, ILibrary } from '../../../../shared/database/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from 'app/services/data.service';
import { IpcFrontend } from '../../../../shared/ipc/frontend';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  collectionForm: FormGroup;
  libraries: any = [];

  constructor(private electron: ElectronService, private fb: FormBuilder, private _snack: MatSnackBar, private _data: DataService, private _router: Router) { }

  /**
   * On init lifecycle hook
   */
  ngOnInit(): void {
    this.collectionForm = this.fb.group({
      library: '',
      name: '',
      backup: '',
      base: '',
      preview: '',
      files: '',
      edited: '',
      socialMedia: '',
      favorites: ''
    });

    IpcFrontend.getLibraries().forEach((library: ILibrary) => {
      this.libraries.push(library.library);
    });
  }

  /**
   * Function to save a collection in the database
   */
  saveCollection() {
    let form: ICollection = this.collectionForm.value;
    let data: ICollection = {
      library: form.library, name: form.name, backup: form.backup, base: form.base,
      preview: form.preview, files: form.files, edited: form.edited, socialMedia: form.socialMedia,
      favorites: form.favorites, collection: this.electron.path.join(form.library, form.name)
    };

    IpcFrontend.saveCollection(data);

    this._snack.open(`Collection '${this.electron.path.join(form.library, form.name)}' saved!`, "Dismiss", {
      duration: 2000,
      horizontalPosition: "end"
    });

    this._router.navigateByUrl('/main');
  }
}
