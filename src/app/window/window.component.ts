import { Component, OnInit, ViewChild } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';
import { IAlbum, IFlow, IPreview } from '../../../shared/database/interfaces';
import { DataService } from '../services/data.service';
import { Logger } from '../../../shared/logger/logger';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css'],
})

export class WindowComponent implements OnInit {
  previewList: string[] = [];
  base64List: string[] = [];
  selectedFlow: string;
  displayFlows: IFlow;
  flows: string[] = [];
  tabFlows: IFlow;
  selectedAlbum: IAlbum;
  @ViewChild('tabs') tabGroup: MatTabGroup;
  
  constructor(private _electron: ElectronService, private _data: DataService) { }

  ngOnInit(): void {
    // Observer listens to selected album changes
    this._data.ctxSelectedAlbum.subscribe((album: IAlbum) => {
      this.flows = [];
      this.selectedAlbum = album;

      this.tabFlows = this._electron.ipcRenderer.sendSync("get-flows", this._data.selectedCollection);
      console.log(this.tabFlows);

      this._data.flowsInCollection = this.tabFlows;

      // Display the the flows in the tab selector in a specified order
      this.flows.push(this.tabFlows.preview);
      this.flows.push(this.tabFlows.edited);
      this.flows.push(this.tabFlows.socialMedia);

      console.log(this.flows);

      this.setFlow(this.tabFlows.preview);
      this.displayPictures();

      let isStarted: boolean = this._electron.ipcRenderer.sendSync("get-album-started", this._data.selectedAlbum.album);

      this._data.setAlbumStarted(this._data.selectedAlbum.album, isStarted);

    });
  }

  /**
   * Encode a picture to base64
   * @param path Absolute path to the picture
   */
  encodeBase64(path) {
    let base64 = this._electron.fs.readFileSync(path).toString('base64');

    return `data:image/jpg;base64,${ base64 }`
  }

  /**
   * Select a flow using the tab component
   * @param event Tab events
   */
  selectedFlowEvent(event) {
    this.selectedFlow = event.tab.textLabel;

    this.displayPictures();
  }

  /**
   * Display picture from a selected flow
   */
  displayPictures() {
    // Clear array when a flow is selected
    this.base64List = [];
    this._data.selectedFlow = this.selectedFlow;

    // Display pictures from a selected flow
    if(this.selectedFlow == this.tabFlows.preview) {
      
      this._electron.ipcRenderer.sendSync("get-preview-pictures", this.selectedAlbum.album).forEach((picture: IPreview) => {
        this.base64List.push(this.encodeBase64(picture.preview));     
      });

    } else if(this.selectedFlow == this.tabFlows.edited) {
      // Edited flow is selected
    } else if(this.selectedFlow == this.tabFlows.socialMedia) {
      // Social media flow is selected
    } else {
      Logger.Log().error(`Selected flow: invalid flow is selected`);
    }
  }

  setFlow(flow: string) {
    this.selectedFlow = flow;
    this._data.selectedFlow = flow;
    this.tabGroup.selectedIndex = this.flows.indexOf(flow);
  }
}
