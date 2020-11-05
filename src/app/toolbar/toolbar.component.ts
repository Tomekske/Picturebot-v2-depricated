import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';
import { IAlbum, IBase, ICollection, IFlow, IPreview } from '../../../shared/database/interfaces';
import { Helper } from '../../../shared/helper/helper';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  collections = [];
  selectedCollection: string;
  isStarted: boolean;
  explorerTooltip: string;
  flowPath: string;

  constructor(private _electron: ElectronService, private _data: DataService, private _router: Router) { }

  /**
   * On init lifecycle hook
   */
  ngOnInit(): void {
    this.isStarted = true;

    // Observers for changes in the selected flow variable
    this._data.ctxSelectedFlow.subscribe((flow) => {
      this.flowPath = this._electron.path.join(this._data.selectedAlbum.album, flow);
      console.log(`FLOOOOOOOOOOOWPAAAAAAAAAATH: ${this.flowPath}`);

      this.explorerTooltip = `Open ${flow} flow in explorer`;
    });
  }

  /**
   * After view lifecycle hook
   */
  ngAfterViewInit() {
    // Push the collections to the collection array in order to display all collection on the selector component
    this._electron.ipcRenderer.sendSync("get-collections").forEach((collection: ICollection) => {
      this.collections.push(collection.collection);
    });
  }

  /**
   * Selecting item within the selection component
   * @param $event Selection events
   */
  selectedCollectionEvent($event) {
    let selectedAlbum = this._electron.ipcRenderer.sendSync("get-single-album", this.selectedCollection);
    this._data.selectedCollection = this.selectedCollection;
    this.isStarted = Boolean(Number(selectedAlbum.started));
    this._data.isAlbumSelectorVisible = true;

    this._router.navigateByUrl('/main');
  }

  /**
   * Start organizing pictures within the base flow and preview flow
   */
  startClickEvent() {
    let album: IAlbum = this._data.selectedAlbum;

    album.collection = this._data.selectedCollection;

    // Update the is organized to true
    this._electron.ipcRenderer.sendSync("update-album-started", this._data.selectedAlbum);

    // value must be set to true
    this._data.setAlbumStarted(this._data.selectedAlbum.album, true);

    // Get the preview and base flow from a certain collection
    let startFlows: IFlow = this._electron.ipcRenderer.sendSync("get-started-flow", this.selectedCollection);

    // Iterate over every key-value pair in the startFlows array
    for (const [key, flow] of Object.entries(startFlows)) {
      // Counter is used as picture indexer
      let counter = 0;

      // Get all the base flow pictures
      if (flow == startFlows.base) {

        this._electron.ipcRenderer.sendSync("get-baseFLow-pictures", album.album).forEach((picture: IBase) => {
          // D:\Test\Forests\Woods 03-11-2020\Base\Woods_03-11-2020_00001.{extension}
          let destination = this._electron.path.join(picture.album, flow, Helper.renameOrganizesPicture(picture, ++counter, 5));

          // Rename pictures with the new file name
          this._electron.fs.rename(picture.destination, destination, function (err) {
            if (err) console.log('ERROR: ' + err);
          });

          let update = { name: this._electron.path.basename(destination), destination: picture.destination, album: picture.album, dest: destination };

          this._electron.ipcRenderer.sendSync("update-name-baseFlow", update);
        });
      }

      // Get all the preview flow pictures
      else if (flow == startFlows.preview) {
        this._electron.ipcRenderer.sendSync("get-previewFLow-pictures", album.album).forEach((picture: IPreview) => {
          // D:\Test\Forests\Woods 03-11-2020\Base\Woods_03-11-2020_00001.{extension}
          let destination = this._electron.path.join(picture.album, flow, Helper.renameOrganizesPicture(picture, ++counter, 5, true));

          // Rename pictures with the new file name
          this._electron.fs.rename(picture.preview, destination, function (err) {
            if (err) console.log('ERROR: ' + err);
          });

          let update = { name: this._electron.path.basename(destination), destination: picture.preview, album: picture.album, dest: destination };

          this._electron.ipcRenderer.sendSync("update-name-previewFlow", update);
        });
      }
    }
  }

  /**
   * Get all collections when clicking on the selection box
   */
  selectionClickEvent() {
    if (this.collections.length != 0) {
      this.collections = [];
    }

    this._electron.ipcRenderer.sendSync("get-collections").forEach((collection: ICollection) => {
      this.collections.push(collection.collection);
    });
  }

  /**
   * Open flow in explorer
   */
  openInExplorerEvent() {
    Helper.openInExplorer(this.flowPath);
  }
}
