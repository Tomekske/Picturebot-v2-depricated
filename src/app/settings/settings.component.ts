import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElectronService } from '../core/services/electron/electron.service';
import { Logger } from '../../../logger';
import { ILibrary } from '../../../shared/database/interfaces';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
/** settings component*/
export class SettingsComponent implements OnInit { 
  settingsForm: FormGroup;

  constructor(private electron: ElectronService, private fb: FormBuilder) { }

  ngOnInit(): void {
    let xxx = {};
    const tableExists = this.electron.ipcRenderer.sendSync("check-tableExists");

    if (tableExists) {
      xxx = this.electron.ipcRenderer.sendSync("get-settings");
    }

    else {
      xxx = {
        uploadEdited: '',
        uploadSocialMedia: '',
        sofwareEditing: '',
        sofwarePostProcessing: '',
        fileType: '',
        logLevel: '',
        conversion: ''
      };
    }

    this.settingsForm = this.fb.group(xxx);
  }

  saveSettings() {
    Logger.Log().debug("Logger TEST");
    console.log(this.settingsForm.value);
    this.electron.ipcRenderer.send("save-settings", this.settingsForm.value);
  }
}
