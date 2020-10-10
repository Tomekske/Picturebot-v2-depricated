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
  }

  ngOnInit() {
    console.log("ngOnInit");
  }

  isShowSettings: boolean = true;
  isShowDisplay: boolean = true;
  isShowAlbum: boolean = true;
  isShowCollection: boolean = true;
  isShowLibrary: boolean = true;
  sendAlbums: string[] = [];

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

  receiveAlbumState($event) {
    console.log("receiveAlbumState");
    this.isShowAlbum = $event;
    console.log(this.isShowAlbum);
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

  // receivedLibraries($event) {
  //   console.log('receivedLibraries');
  //   this.sendAlbums = $event;
  //   console.error(this.sendAlbums);
  // }
}
