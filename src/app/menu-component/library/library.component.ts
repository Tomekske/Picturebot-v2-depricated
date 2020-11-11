import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElectronService } from '../../core/services/electron/electron.service';
import { ILibrary } from '../../../../shared/database/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from 'app/services/data.service';
import { IpcFrontend } from '../../../../shared/ipc/frontend';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  libraryForm: FormGroup;

  constructor(private electron: ElectronService, private fb: FormBuilder, private _snack: MatSnackBar, private _data: DataService, private _router: Router) { }

  /**
   * On init lifecycle hook
   */
  ngOnInit(): void {
    this.libraryForm = this.fb.group({
      base: '',
      name: ''
    });

    this._data.isAlbumSelectorVisible = false;
  }

  /**
   * Function to save a library to the database
   */
  saveLibrary() {
    let form: ILibrary = this.libraryForm.value;
    let data: ILibrary = { name: form.name, base: form.base, library: this.electron.path.join(form.base, form.name) };

    IpcFrontend.saveLibrary(data);

    this._snack.open(`Library '${this.electron.path.join(form.base, form.name)}' saved!`, "Dismiss", {
      duration: 4000,
      horizontalPosition: "end"
    });

    this._router.navigateByUrl('/main');
  }
}
