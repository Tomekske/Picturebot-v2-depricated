import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ISettings } from '../../../../shared/database/interfaces';
import { IpcFrontend } from '../../../../shared/ipc/frontend';
import { Regex, Message, MenuText } from '../../../../shared/helper/enums';
import { DataService } from 'app/services/data.service';

export interface IForm {
  uploadEdited?: string;
  uploadSocialMedia?: string;
  sofwareEditing?: string;
  sofwarePostProcessing?: string;
  conversion?: string;  
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
/** settings component*/
export class SettingsComponent implements OnInit { 
  settingsForm: FormGroup;
  formData = {};
  submitted: boolean = false;
  message = Message;

  constructor(private _data: DataService, private fb: FormBuilder, private _snack: MatSnackBar, private _router: Router) { }

  /**
   * On init lifecycle hook
   */
  ngOnInit(): void {
    this._data.IsPictures = false;
    this._data.MenuText = MenuText.settings;
    
    const isEmpty = IpcFrontend.checkSettingsEmpty();

    // If the settings row is empty initialize the object with empty values
    if (isEmpty) {
      this.formData = {
        uploadEdited: ['', Validators.pattern(Regex.Website)],
        uploadSocialMedia: ['', Validators.pattern(Regex.Website)],
        sofwarePostProcessing: ['', Validators.pattern(Regex.File)],
        conversion: ['', [Validators.required, Validators.pattern(Regex.Percentage)]]
      };
    } else {
      let settings: ISettings = IpcFrontend.getSettings();

      this.formData = {
        uploadEdited: [settings.uploadEdited, Validators.pattern(Regex.Website)],
        uploadSocialMedia: [settings.uploadSocialMedia, Validators.pattern(Regex.Website)],
        sofwarePostProcessing: [settings.sofwarePostProcessing, Validators.pattern(Regex.File)],
        conversion: [settings.conversion, [Validators.required, Validators.pattern(Regex.Percentage)]]
      };
    }

    this.settingsForm = this.fb.group(this.formData);
  }

  /**
   * Method that simplifies getting the form controls 
   */
  get form() { 
    return this.settingsForm.controls; 
  }

  /**
   * Function to save data into the database
   */
  saveSettings() {
    IpcFrontend.saveSettings(this.settingsForm.value);

    // Return on validation errors
    if (this.settingsForm.invalid) {
      this._snack.open(`Input values are invalid!`, "Dismiss", {
        duration: 4000,
        horizontalPosition: "end"
      });
      
      return;
    }

    this._snack.open(`Settings saved!`, "Dismiss", {
      duration: 4000,
      horizontalPosition: "end",
      panelClass: "snackbar-id"
    });

    this._router.navigateByUrl('/main');
  }

  /**
   * Clear the input value of an control element
   * @param control Control element name
   */
  clearInput(control: string) {
    this.settingsForm.controls[control].reset();
  }
}
