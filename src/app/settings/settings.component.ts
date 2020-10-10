import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  isShowSettings: boolean = false;
  @Output() sendIsShowSettings = new EventEmitter<boolean>();

  constructor(private electron: ElectronService, private fb: FormBuilder) { }

  ngOnInit(): void {
    let xxx = {};
    console.log("WEEEEERKT");
    const isEmpty = this.electron.ipcRenderer.sendSync("check-settings-empty");
    console.log(`NOG STEEEEEDS: ${isEmpty}`);

    if (isEmpty) {
      console.log("TABEL LEEEG");
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

    else {
      console.log("TABEL NIEEET LEEG");
      xxx = this.electron.ipcRenderer.sendSync("get-settings");
    }

    this.settingsForm = this.fb.group(xxx);
  }

  saveSettings() {
    Logger.Log().debug("Save settings");
    this.electron.ipcRenderer.send("save-settings", this.settingsForm.value);

    this.isShowSettings = !this.isShowSettings;
    this.sendIsShowSettings.emit(this.isShowSettings);
  }
}
