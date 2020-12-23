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
import { DialogAlbumEditComponent } from 'app/dialogs/dialog-album-edit/dialog-album-edit.component';

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
  isPictures: boolean = true;
  menuText: string = "";
  
  constructor(private _electron: ElectronService, private _data: DataService, private _router: Router, private _snack: MatSnackBar, private cdRef:ChangeDetectorRef, private _dialog: MatDialog) { }

  /**
   * On init lifecycle hook
   */
  ngOnInit(): void {
    this.isOrganized = true;

    // Monitor whether a new album is saved
    this._data.ctxIsAlbumSaved.subscribe(state => {
      if(state) {
        this.albums = IpcFrontend.getAlbums(this.selectedCollection);
      }
    });

    // Monitor whether the user switches pages and display the menu text accordingly
    this._data.ctxIsPictures.subscribe(state => this.isPictures = state);
    this._data.ctxMenuText.subscribe(text => this.menuText = text);
    this._data.ctxIsCollectionSaved.subscribe(state => {
      if(state) {
        // Get all the collections
        IpcFrontend.getCollections().forEach((collection: ICollection) => this.collections.push(collection.collection));

        // Display a default collection when the collection array isn't empty
        if(this.collections.length != 0) {
          this.selectedCollection = this.collections[0];
          this.selectedCollectionEvent();  
        }
        this.albums = IpcFrontend.getAlbums(this.selectedCollection);
      }
    });

    // Get all the collections
    IpcFrontend.getCollections().forEach((collection: ICollection) => {
      this.collections.push(collection.collection);
    });

    // Display a default collection when the collection array isn't empty
    if(this.collections.length != 0) {
      this.selectedCollection = this.collections[0];
      this.selectedCollectionEvent();
    }
    this.albums = IpcFrontend.getAlbums(this.selectedCollection);

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
    this._data.selectedCollection = this.selectedCollection;
    this._data.isAlbumSelectorVisible = true;
      
    this._router.navigateByUrl('/main');
  }

  /**
   * Start organizing pictures within the base flow and preview flow
   */
  startClickEvent() {
    // Get the preview and base flow from a certain collection
    let startFlows: IFlow = IpcFrontend.getStartingFlows(this.selectedAlbum.collection);

    // Iterate over every key-value pair in the startFlows array
    for (const [key, flow] of Object.entries(startFlows)) {
      // Counter is used as picture indexer
      let counter = 0;

      // Get all the base flow pictures
      if (flow == startFlows.base) {

        IpcFrontend.getBaseFlowPictures(this.selectedAlbum.album).forEach((picture: IBase) => {
          // D:\Test\Forests\Woods 03-11-2020\Base\Woods_03-11-2020_00001.{extension}
          let destination = this._electron.path.join(picture.album, flow, Helper.renameOrganizesPicture(picture, ++counter, 5));
          let previewDestination = this._electron.path.join(picture.album, startFlows.preview, Helper.renameOrganizesPicture(picture, counter, 5, true));

          // Rename pictures with the new file name
          this._electron.fs.rename(picture.base, destination, function (err) {
            if (err) console.log('ERROR: ' + err);
          });

          let update = { name: this._electron.path.basename(destination), base: picture.base, album: picture.album, updatedBase: destination, preview: previewDestination, backup: picture.base.replace(startFlows.base, startFlows.backup) };
          IpcFrontend.updateBaseFlowName(update);
        });
      }

      // Get all the preview flow pictures
      else if (flow == startFlows.preview) {
        IpcFrontend.getPreviewFlowPictures(this.selectedAlbum.album).forEach((picture: IPreview) => {
          // D:\Test\Forests\Woods 03-11-2020\Base\Woods_03-11-2020_00001.{extension}
          let destination = this._electron.path.join(picture.album, startFlows.preview, Helper.renameOrganizesPicture(picture, ++counter, 5, true));
          let baseDestination = this._electron.path.join(picture.album, startFlows.base, Helper.renameOrganizesPicture(picture, counter, 5));

          // Rename pictures with the new file name
          this._electron.fs.rename(picture.preview, destination, function (err) {
            if (err) console.log('ERROR: ' + err);
          });

          let update = { name: this._electron.path.basename(destination), preview: picture.preview, album: picture.album, updatedPreview: destination, base: baseDestination };
          IpcFrontend.updatePreviewFlowName(update);
        });
      }
    }

    // Update the is organized to true
    IpcFrontend.updateAlbumIsOrganized(this.selectedAlbum, true);

    // value must be set to true
    this._data.setAlbumStarted(this.selectedAlbum.album, true);

    // Making sure to update the album 
    this.isOrganized = true;
    // Updating the album, because the album won't be updated if the collection hasn't changed
    this._data.IsStarted = true;

    this._snack.open(`Album '${this.selectedAlbum.album}' organized`, "Dismiss", {
      duration: 4000,
      horizontalPosition: "end"
    });
  }

  /**
   * Get all collections when clicking on the selection box
   */
  selectionClickEvent() {
    // Make sure to clear the collections array before pushing the collections from the database on the array
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

  /**
   * Delete an album relation from the database
   */
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

        this.albums = IpcFrontend.getAlbums(this.selectedCollection);

        this._snack.open(`Album '${this.selectedAlbum.album}' deleted`, "Dismiss", {
          duration: 4000,
          horizontalPosition: "end"
        });
      }
    });
  }

  /**
   * Edit album information
   */
  editAlbum() {
    // Picture deletion dialog
    this._dialog.open(DialogAlbumEditComponent, { 
      data: { 
        album: this.selectedAlbum
      }
    }).afterClosed().subscribe(form => {
      let updatedAlbum: IAlbum = {  
        collection: this.selectedAlbum.collection,
        name: form.album, 
        date: Helper.formatDate(form.date), 
        album: this._electron.path.join(this.selectedAlbum.collection, `${form.album} ${Helper.formatDate(form.date)}`), // error
        started: this.selectedAlbum.started
      };

      IpcFrontend.updateAlbum(this.selectedAlbum.album, updatedAlbum);
      Helper.renameDirectory(this.selectedAlbum.album, updatedAlbum.album);
      this._data.isAlbumUpdated = true;
    });
  }
}
