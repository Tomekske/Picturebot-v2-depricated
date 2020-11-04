import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElectronService } from '../../core/services/electron/electron.service';
import { Logger } from '../../../../shared/logger/logger';
import { ILibrary } from '../../../../shared/database/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
/** settings component*/
export class SettingsComponent implements OnInit { 
  settingsForm: FormGroup;

  constructor(private electron: ElectronService, private fb: FormBuilder, private _snack: MatSnackBar, private _router: Router) { }

  /**
   * On init lifecycle hook
   */
  ngOnInit(): void {
    let formData = {};
    const isEmpty = this.electron.ipcRenderer.sendSync("check-settings-empty");

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
      formData = this.electron.ipcRenderer.sendSync("get-settings");
    }

    this.settingsForm = this.fb.group(formData);
  }

  /**
   * Function to save data into the database
   */
  saveSettings() {
    this.electron.ipcRenderer.send("save-settings", this.settingsForm.value);

    this._snack.open(`Settings saved!`, "Dismiss", {
      duration: 4000,
      horizontalPosition: "end"
    });

    this._router.navigateByUrl('/main');
  }
}
