import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';
import { IAlbum, IBase, ICollection, IFlow, IPreview } from '../../../shared/database/interfaces';
import { Helper } from '../../../shared/helper/helper';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IpcFrontend } from '../../../shared/ipc/frontend';
import { MatDialog } from '@angular/material/dialog';
import { DialogAlbumDeleteComponent } from 'app/dialogs/dialog-album-delete/dialog-album-delete.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  collections: string[] = [];
  selectedCollection: string;
  explorerTooltip: string;
  flowPath: string;
  albums: IAlbum[] = [];
  isOrganized: boolean;
  selectedAlbum: IAlbum;

  constructor(private _electron: ElectronService, private _data: DataService, private _router: Router, private _snack: MatSnackBar, private cdRef:ChangeDetectorRef, private _dialog: MatDialog) { }

  /**
   * On init lifecycle hook
   */
  ngOnInit(): void {
    this.isOrganized = true;
    // Get all the collections
    IpcFrontend.getCollections().forEach((collection: ICollection) => {
      this.collections.push(collection.collection);
    });

    // Display a default collection when the collection array isn't empty
    if(this.collections.length != 0) {
      this.selectedCollection = this.collections[0];
      this.selectedCollectionEvent();  
    }

    // Monitor wether a new album is selected
    this._data.ctxSelectedAlbum.subscribe(album => {
      // Check wether an album is organized and display the correct toolbar action
      album.started ? this.isOrganized = true : this.isOrganized = false;
      this.selectedAlbum = album;
    });
  }

  /**
   * Selecting item within the selection component
   * @param $event Selection events
   */
  selectedCollectionEvent() {
    this._data.isAlbumSelectorVisible = true;
    this._data.selectedCollection = this.selectedCollection;
      
    this._router.navigateByUrl('/main');
  }

  /**
   * Start organizing pictures within the base flow and preview flow
   */
  startClickEvent() {
    let album: IAlbum = this._data.selectedAlbum;

    album.collection = this._data.selectedCollection;

    // Update the is organized to true
    IpcFrontend.updateAlbumIsOrganized(this._data.selectedAlbum, true);

    // value must be set to true
    this._data.setAlbumStarted(this._data.selectedAlbum.album, true);

    // Get the preview and base flow from a certain collection
    let startFlows: IFlow = IpcFrontend.getStartingFlows(this.selectedCollection);

    // Iterate over every key-value pair in the startFlows array
    for (const [key, flow] of Object.entries(startFlows)) {
      // Counter is used as picture indexer
      let counter = 0;

      // Get all the base flow pictures
      if (flow == startFlows.base) {

        IpcFrontend.getBaseFlowPictures(album.album).forEach((picture: IBase) => {
          // D:\Test\Forests\Woods 03-11-2020\Base\Woods_03-11-2020_00001.{extension}
          let destination = this._electron.path.join(picture.album, flow, Helper.renameOrganizesPicture(picture, ++counter, 5));

          // Rename pictures with the new file name
          this._electron.fs.rename(picture.destination, destination, function (err) {
            if (err) console.log('ERROR: ' + err);
          });

          let update = { name: this._electron.path.basename(destination), destination: picture.destination, album: picture.album, dest: destination };

          IpcFrontend.updateBaseFlowName(update);
        });
      }

      // Get all the preview flow pictures
      else if (flow == startFlows.preview) {
        IpcFrontend.getPreviewFlowPictures(album.album).forEach((picture: IPreview) => {
          // D:\Test\Forests\Woods 03-11-2020\Base\Woods_03-11-2020_00001.{extension}
          let destination = this._electron.path.join(picture.album, flow, Helper.renameOrganizesPicture(picture, ++counter, 5, true));

          // Rename pictures with the new file name
          this._electron.fs.rename(picture.preview, destination, function (err) {
            if (err) console.log('ERROR: ' + err);
          });

          let update = { name: this._electron.path.basename(destination), destination: picture.preview, album: picture.album, dest: destination };

          IpcFrontend.updatePreviewFlowName(update);
        });
      }
    }

    // Making sure to update the album 
    this.isOrganized = true;
    // Updating the album, because the album won't be updated if the collection hasn't changed
    this._data.selectedAlbum.started = 1;
  }

  /**
   * Get all collections when clicking on the selection box
   */
  selectionClickEvent() {
    if (this.collections.length != 0) {
      this.collections = [];
    }

    IpcFrontend.getCollections().forEach((collection: ICollection) => {
      this.collections.push(collection.collection);
    });
  }

  /**
   * Open flow in explorer
   */
  openInExplorerEvent() {
    this.flowPath = this._electron.path.join(this._data.selectedAlbum.album, this._data.selectedFlow);

    Helper.openInExplorer(this.flowPath, this._snack);
  }

  deleteAlbum() {
    // Picture deletion dialog
    this._dialog.open(DialogAlbumDeleteComponent, { 
      data: { 
        album: this.selectedAlbum,
        flow: this._data.selectedFlow
      }
    }).afterClosed().subscribe(confirmed => {
      // Only delete pictures on confirmation
      if(confirmed) {
        IpcFrontend.deleteAlbum(this.selectedAlbum);

        this._data.isAlbumDeleted = true;

        this._snack.open(`Album '${this.selectedAlbum.album}' deleted`, "Dismiss", {
          duration: 4000,
          horizontalPosition: "end"
        });
      }
    });
  }
}
