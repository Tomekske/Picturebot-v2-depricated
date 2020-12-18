import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { DataService } from 'app/services/data.service';
import { Subscription } from 'rxjs';
import { IAlbum, IBase, IFlow, IPreview } from '../../../shared/database/interfaces';
import { Logger } from '../../../shared/logger/logger';
import { MatDialog } from '@angular/material/dialog';
import { DialogPictureInfoComponent } from 'app/dialogs/dialog-picture-info/dialog-picture-info.component';
import { IpcFrontend } from '../../../shared/ipc/frontend';
import { DialogPictureDeleteComponent } from 'app/dialogs/dialog-picture-delete/dialog-picture-delete.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Helper } from '../../../shared/helper/helper';
import { cwd } from 'process';

/**
 * Display interface containing properties 
 */
export interface IDisplay {
  /** Picture path containing 'file:// prefix */
  location: string;
  /** Preview picture location */
  preview: string;
  /** Base picture location */
  base: string;
  /** Is favorited property of an image */
  favorited?: boolean;
}

@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.css']
})
export class PicturesComponent implements OnInit {
  previewList: IPreview[] = [];
  pictureList: IDisplay[] = [];
  selectedFlow: string;
  flows: string[] = [];
  tabFlows: IFlow;
  selectedAlbum: IAlbum;
  selectedCollection: string;
  @ViewChild('tab') tabGroup: MatTabGroup;
  subscription: Subscription; 
  albums: IAlbum[] = [];
  isVisible: boolean = false;
  isOrganized: boolean;

  constructor(private _data: DataService, private cdRef:ChangeDetectorRef, private _dialog: MatDialog, private _snack: MatSnackBar) { }
  
  /**
   * On init lifecycle hook
   */
  ngOnInit(): void {
    this._data.IsPictures = true;

    // Monitor for collection changes
    this._data.ctxSelectedCollection.subscribe(collection => {
      console.log("Text");
      console.log(`COLLECTION: ${collection}`);
      this.isVisible = false;
      this.selectedCollection = collection;
      // Get the albums within a certain collection
      this.albums = IpcFrontend.getAlbums(collection);

      console.log(this.albums);

      // Select the first album as the default album
      if (typeof this.albums[0] !== 'undefined' && this.albums.length !== 0) {
        console.log("ERIIIN");
        // Make the album selector visible
        this.isVisible = this._data.isAlbumSelectorVisible;

        this.selectedAlbumEvent(this.albums[0]);
      }
    });

    // Monitor if an album is deleted
    this._data.ctxIsAlbumDeleted.subscribe(state => {
      if(state) {
        // Get the albums within a certain collection
        this.albums = IpcFrontend.getAlbums(this.selectedCollection);

        // Select the first album as the default album
        if (typeof this.albums[0] !== 'undefined') {
          this.selectedAlbumEvent(this.albums[0]);
        } else {
          this.pictureList = [];
          this.isVisible = this._data.isAlbumSelectorVisible = false;
        }
      }
    });

    // Monitor whether the album is edited
    this._data.ctxIsAlbumUpdated.subscribe(state => {
      if(state) {
        // Get the albums within a certain collection
        this.albums = IpcFrontend.getAlbums(this.selectedCollection);
        this.selectedAlbumEvent(this.albums[0]);
      }
    });

    // Monitor whether an album is organized
    this._data.ctxIsStarted.subscribe(state => {
      // Checks are needed to select the correct album since the subscription is triggered twice
      if(state && this.albums.length !== 0) {
        // Iterate over pictures until the correct album is found
        this.albums.forEach((album) => {
          if(album.album === this._data.selectedAlbum.album) {
            // Get the old index number of the selected album
            let index: number = this.albums.indexOf(this._data.selectedAlbum);
            // Obtain the updated album information
            this.albums = IpcFrontend.getAlbums(this.selectedCollection);
            this.selectedAlbumEvent(this.albums[index]);
            this.displayPictures();
            this.isOrganized = true;
          }
        });
      }
    });
  }

  /**
   * Select a flow using the tab component
   * @param event Tab events
   */
  selectedFlowEvent(event) {
    this.selectedFlow = event.tab.textLabel;
    this._data.selectedFlow = event.tab.textLabel;
    this.displayPictures();
  }

  /**
   * Display picture from a selected flow
   */
  displayPictures() {
    // Clear array when a flow is selected
    this.pictureList = [];
    
    // Display pictures from a selected flow
    if(this.selectedFlow == this.tabFlows.preview) {
      this.isOrganized = Boolean(this.selectedAlbum.started);

      IpcFrontend.getPreviewFlowPictures(this.selectedAlbum.album).forEach((picture: IPreview) => {
        let isFavorite = IpcFrontend.getIsFavoriteBaseFlowWherePreview(picture.preview);

        this.pictureList.push({ location: `file://${picture.preview}`, favorited: isFavorite, preview: picture.preview, base: picture.base });
      });
      this.isOrganized = Boolean(this.selectedAlbum.started);

    } else if(this.selectedFlow == this.tabFlows.favorites) {
      IpcFrontend.getFavoritesFlowPictures(this.selectedAlbum.album).forEach((picture: IBase) => {
        let isFavorite = IpcFrontend.getIsFavoriteBaseFlowWherePreview(picture.preview);
        this.pictureList.push({ location: `file://${picture.preview}`, preview: picture.preview, base: picture.base });
      });

      this.isOrganized = Boolean(this.selectedAlbum.started);
    } else if(this.selectedFlow == this.tabFlows.edited) {
      // Edited flow is selected
    } else if(this.selectedFlow == this.tabFlows.socialMedia) {
      // Social media flow is selected
    } else {
      Logger.Log().error(`Selected flow: invalid flow is selected`);
    }
  }

  /**
   * Select an album from the list
   */
  selectedAlbumEvent(album: IAlbum) {
    this.flows = [];
    this.selectedAlbum = album;
    this._data.selectedAlbum = album;
    this.tabFlows = IpcFrontend.getTabFlows(album.collection);

    this.displayFlows(this.tabFlows);
    this.displayPictures();
  }

  /**
   * Display the tab flow in the tab component 
   */
  displayFlows(flows: IFlow) {
    this.flows = [];
    // Display the the flows in the tab selector in a specified order
    this.flows.push(flows.preview);
    this.flows.push(flows.favorites);
    this.flows.push(flows.edited);
    this.flows.push(flows.socialMedia);
    this.selectedFlow = flows.preview;
    this._data.selectedFlow = flows.preview;

    // Make sure the first flow is selected by default
    this.cdRef.detectChanges();
    this.tabGroup.selectedIndex = this.flows.indexOf(flows.preview);
  }

  /**
   * Display a picture's metadata
   * @param index Index of the picture within the array
   */
  openPictureInformation(index: number) {
    this.previewList = [];
    this.previewList = IpcFrontend.getPreviewFlowPictures(this.selectedAlbum.album);

    this._dialog.open(DialogPictureInfoComponent, { 
      data: 
        { album: this.previewList[index] }
    });
  }

  /**
   * Delete a picture from an album
   * @param index Index of the picture within the array
   */
  deletePicture(index: number) {
    this.previewList = [];

    this.previewList = IpcFrontend.getPreviewFlowPictures(this.selectedAlbum.album);
    let baseList: IBase = IpcFrontend.getBaseFlowPictures(this.selectedAlbum.album);

    // Picture deletion dialog
    this._dialog.open(DialogPictureDeleteComponent, { 
      data: { 
        picture: this.previewList[index],
        flow: this.selectedFlow 
      }
    }).afterClosed().subscribe(confirmed => {
      // Only delete pictures on confirmation
      if(confirmed) {
        IpcFrontend.favoriteFlowDeletePicture(this.previewList[index].preview);
        IpcFrontend.previewFlowDeletePicture(this.previewList[index].preview);
        IpcFrontend.baseFlowDeletePicture(baseList[index].base);

        this.displayPictures();

        this._snack.open(`Picture '${baseList[index].name}' deleted`, "Dismiss", {
          duration: 4000,
          horizontalPosition: "end"
        });
      }
    });
  }

  /**
   * Update the favorited boolean of a specified picture
   * @param index Index of the picture within the array
   */
  updateFavorite(index: number) {
    let pictures: IBase[] = IpcFrontend.getPreviewFlowPictures(this.selectedAlbum.album);

    if(this.pictureList[index].favorited) {
      this.pictureList[index].favorited = false;
      IpcFrontend.updateFavorited(this.pictureList[index].preview, false);
      IpcFrontend.deleteFavoriteWhereBase(pictures[index].base);
    } else {
      this.pictureList[index].favorited = true;
      IpcFrontend.updateFavorited(this.pictureList[index].preview, true);
      let x: IBase = { collection: this.selectedCollection, album: this.selectedAlbum.album, preview: pictures[index].preview, base: pictures[index].base}
      IpcFrontend.saveFavorite(x);
    }
  }
}
