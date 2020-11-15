import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElectronService } from '../../core/services/electron/electron.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from 'app/services/data.service';
import { IpcFrontend } from '../../../../shared/ipc/frontend';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
/** settings component*/
export class SettingsComponent implements OnInit { 
  settingsForm: FormGroup;

  constructor(private electron: ElectronService, private fb: FormBuilder, private _snack: MatSnackBar, private _data: DataService, private _router: Router) { }

  /**
   * On init lifecycle hook
   */
  ngOnInit(): void {
    let formData = {};
    const isEmpty = IpcFrontend.checkSettingsEmpty();
    
    // If the settings row is empty initialize the object with empty values
    if (isEmpty) {
      formData = {
        uploadEdited: '',
        uploadSocialMedia: '',
        sofwareEditing: '',
        sofwarePostProcessing: '',
        fileType: '',
        logLevel: '',
        conversion: ''
      };
    } else {
      formData = IpcFrontend.getSettings();
    }

    this.settingsForm = this.fb.group(formData);
  }

  /**
   * Function to save data into the database
   */
  saveSettings() {
    IpcFrontend.saveSettings(this.settingsForm.value);

    this._snack.open(`Settings saved!`, "Dismiss", {
      duration: 4000,
      horizontalPosition: "end"
    });

    this._router.navigateByUrl('/main');
  }
}
