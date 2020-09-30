import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private electron: ElectronService, private translate: TranslateService) {
    this.translate.setDefaultLang('en');

    //logger.Log().warn("Logger TEST");

  }

  ngOnInit() {
    console.log("ngOnInit");
    //this.electronService.ipcRenderer.send("get-settings", "");
    // this.electronService.ipcRenderer.on('parse-settings', (event, args) => {
    //   console.log("Data zou normaalgezien moeten toekomen! :(")
    //   console.log(args);     
    // });

  }

  isShowSettings = true;
  isShowDisplay = true;
  isShowShoot = true;
  isShowCollection = true;
  isShowLibrary = true;

  receiveState($event) {
    console.log("receiveState");
    this.isShowSettings = $event;
    console.log(this.isShowSettings);
  }

  receiveWorkspaceState($event) {
    console.log("receiveWorkspaceState");
    this.isShowDisplay = $event;
    console.log(this.isShowDisplay);
  }

  receiveShootState($event) {
    console.log("receiveShootState");
    this.isShowShoot = $event;
    console.log(this.isShowShoot);
  }

  receiveCollectionState($event) {
    console.log("receiveCollectionState");
    this.isShowCollection = $event;
    console.log(this.isShowCollection);
  }

  receiveLibraryState($event) {
    console.log("receiveLibraryState");
    this.isShowLibrary = $event;
    console.log(this.isShowLibrary);
  }

  ngAfterViewInit() {
    console.log('weeerkt');
    this.electron.ipcRenderer.on('msg', (event, text) => {
      console.log(`WORKS: ${text}`);
    });
  }


}
