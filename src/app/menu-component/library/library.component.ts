import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElectronService } from '../../core/services/electron/electron.service';
import { ILibrary } from '../../../../shared/database/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from 'app/services/data.service';
import { IpcFrontend } from '../../../../shared/ipc/frontend';
import { Message, Regex } from '../../../../shared/helper/enums';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  libraryForm: FormGroup;
  message = Message;

  constructor(private electron: ElectronService, private fb: FormBuilder, private _snack: MatSnackBar, private _data: DataService, private _router: Router) { }

  /**
   * On init lifecycle hook
   */
  ngOnInit(): void {
    this.libraryForm = this.fb.group({
      base: ['', [Validators.required, Validators.pattern(Regex.Folder)]],
      name: ['', [Validators.required, Validators.pattern(Regex.NameNoWhiteSpaces)]]
    });
  }

  /**
   * Method that simplifies getting the form controls 
   */
  get form() { 
    return this.libraryForm.controls; 
  }

  /**
   * Function to save a library to the database
   */
  saveLibrary() {
    let form: ILibrary = this.libraryForm.value;
    let data: ILibrary = { name: form.name, base: form.base, library: this.electron.path.join(form.base, form.name) };


    // Return on validation errors
    if (this.libraryForm.invalid) {
      this._snack.open(`Input values are invalid!`, "Dismiss", {
        duration: 4000,
        horizontalPosition: "end"
      });
          
      return;
    }

    IpcFrontend.saveLibrary(data);

    this._snack.open(`Library '${this.electron.path.join(form.base, form.name)}' saved!`, "Dismiss", {
      duration: 4000,
      horizontalPosition: "end"
    });

    this._router.navigateByUrl('/main');
  }

  /**
   * Clear the input value of an control element
   * @param control Control element name
   */
  clearInput(control: string) {
    this.libraryForm.controls[control].reset();
  }
}
