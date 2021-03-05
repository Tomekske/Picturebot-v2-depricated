import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatTabGroup } from '@angular/material/tabs';
import { DataService } from 'app/services/data.service';
import { Subscription } from 'rxjs';
import { IAlbum, IBase, IDisplay, IEdited, IFlow, IPreview, ISettings, ISocialMedia } from '../../../shared/database/interfaces';
import { Logger } from '../../../shared/logger/logger';
import { MatDialog } from '@angular/material/dialog';
import { IpcFrontend } from '../../../shared/ipc/frontend';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Helper } from '../../../shared/helper/helper';
import { Router } from '@angular/router';
import { Media, Config, LayoutStyle } from 'app/gallery/public-api';

@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.css']
})

export class PicturesComponent implements OnInit {
  previewList: Media[] = [];
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
  pathList: string[] = [];
  isLazy: boolean = true;
  _albums: Array<{src: string, caption: string, thumb: string}>= [];
  title = 'ng-opengallery';
  data: Media[] = [];

  // Gallery options
  config: Config = {
    diaporamaDuration: 5,
    layout: LayoutStyle.SIMPLE,
    prefMediaHeight: 350,
    spacing: 3,
    viewerEnabled: true,
    enableAutoPlay: false
  } 

  styles: string[];

  constructor(private _data: DataService, private cdRef:ChangeDetectorRef, private _dialog: MatDialog, private _snack: MatSnackBar, private _router: Router, @Inject(DOCUMENT) private _document: any) { 
    this.styles = Object.keys(LayoutStyle).filter( (s:any) => isNaN(s));
  }
  /**
   * On init lifecycle hook
   */
  ngOnInit(): void {
    // Making sure it's possible to reload a current URL
    this._router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this._data.IsPictures = true;

    // Monitor for collection changes
    this._data.ctxSelectedCollection.subscribe(collection => {
      this.isVisible = false;
      this.selectedCollection = collection;
      // Get the albums within a certain collection
      this.albums = IpcFrontend.getAlbums(collection);

      // Select the first album as the default album
      if (typeof this.albums[0] !== 'undefined' && this.albums.length !== 0) {
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
          this.pictureList = null;
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

  ngOnDestroy() {
    this.pictureList = null;
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
    this.previewList = null;   
    this.previewList = []; 

    // Display pictures from a selected flow
    if(this.selectedFlow == this.tabFlows.preview) {
  
      this.isOrganized = Boolean(this.selectedAlbum.started);
      var t0 = performance.now();

      IpcFrontend.getPreviewFlowPictures(this.selectedAlbum.album).forEach((picture: IPreview) => {
        let isFavorite = IpcFrontend.getIsFavoriteBaseFlowWherePreview(picture.preview);
        let display: IDisplay = { location: `file://${picture.preview}`, favorited: isFavorite, preview: picture.preview, base: picture.base };

        this.previewList.push(new Media(`file://${picture.preview}`, picture.preview, display));
      });
    }
     else if(this.selectedFlow == this.tabFlows.favorites) {
      IpcFrontend.getFavoritesFlowPictures(this.selectedAlbum.album).forEach((picture: IBase) => {
        let display: IDisplay = { location: `file://${picture.preview}`, preview: picture.preview, base: picture.base };

        this.previewList.push(new Media(`file://${picture.preview}`, picture.preview, display));
      });

      this.isOrganized = Boolean(this.selectedAlbum.started);
    } else if(this.selectedFlow == this.tabFlows.edited) {
      IpcFrontend.getEditedFlowPictures(this.selectedAlbum.album).forEach((picture: IEdited) => {
        let display: IDisplay = { location: `file://${picture.preview}`, preview: picture.edited, base: picture.base };

        this.previewList.push(new Media(`file://${picture.edited}`, picture.edited, display));
      });

      this.isOrganized = Boolean(this.selectedAlbum.started);    
    } else if(this.selectedFlow == this.tabFlows.socialMedia) {
      IpcFrontend.getSocialMediaFlowPictures(this.selectedAlbum.album).forEach((picture: ISocialMedia) => {
        let display: IDisplay = { location: `file://${picture.preview}`, preview: picture.socialMedia, base: picture.base };

        this.previewList.push(new Media(`file://${picture.socialMedia}`, picture.socialMedia, display));
      });

      this.isOrganized = Boolean(this.selectedAlbum.started);    
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
    
    IpcFrontend.selectedAlbum(album);
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
   * Log gallery errors
   * @param error Gallery error object
   */
  galleryOnError(error) {
    Logger.Log().error(error);
  }

  /**
   * Gallery on selection event
   * @param event Gallery selection event object
   */
  galleryOnSelection(event) {
    Helper.windowFullScreen(this._document);
  }

  /**
   * Gallery on open event
   * @param isOpen Checks whether the slideshow is opened
   */
  galleryOnOpen(isOpen) {
    if(!isOpen) {
      Helper.windowCloseFullScreen(this._document);
    }
  }
}
