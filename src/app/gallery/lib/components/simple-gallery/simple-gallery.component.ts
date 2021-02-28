import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MediaContainer } from '../../models/media-container';
import { NgOpengalleryService } from '../../ng-opengallery.service'
import { Subscription } from 'rxjs';
import { DataService } from 'app/services/data.service';
import { IAlbum, IBase, IFlow, IPreview, ISettings } from '../../../../../../shared/database/interfaces';
import { IpcFrontend } from '../../../../../../shared/ipc/frontend';
import { Helper } from '../../../../../../shared/helper/helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogPictureInfoComponent } from 'app/dialogs/dialog-picture-info/dialog-picture-info.component';
import { DialogPictureDeleteComponent } from 'app/dialogs/dialog-picture-delete/dialog-picture-delete.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'simple-gallery',
  templateUrl: './simple-gallery.component.html',
  styleUrls: ['./simple-gallery.component.css']
})
export class SimpleGalleryComponent implements OnInit, OnDestroy {
  selectedFlow: string;
  selectedAlbum: IAlbum;
  tabFlows: IFlow;
  selectedCollection: string;

  @Input()
  public set datasource(v: MediaContainer[]) {
    this._datasource = v;
  }

  public get datasource() {
    return this._datasource;
  }
  private _datasource: MediaContainer[];

  @Input()
  public set prefHeight(v: number) {
    if(v > 0) {
      this._prefHeight = v;
      this.computeMediasDimension(this.galleryElement.nativeElement.offsetWidth - 17);
    }
  }

  public get prefHeight() {
    return this._prefHeight;
  }

  private _prefHeight = 200;

  @Input()
  public set spacing(v: number) {
    if(v >= 0) {
      this._spacing = v;
      this.computeMediasDimension(this.galleryElement.nativeElement.offsetWidth - 17);
    }
  }

  public get spacing() {
    return this._spacing;
  }

  private _spacing: number = 3;

  @Input()
  public set autoplay(v: boolean) {
    this._autoplay = v;
  }

  public get autoplay() {
    return this._autoplay;
  }

  private _autoplay: boolean = true;

  @ViewChild('gallery', {static:true})
  private galleryElement: ElementRef<HTMLDivElement>;
  private differSub: Subscription;

  constructor(private service: NgOpengalleryService, private _data: DataService, private _snack: MatSnackBar, private _dialog: MatDialog) {}

  ngOnInit(): void {
    this._data.ctxSelectedFlow.subscribe(flow => {
      this.selectedFlow = flow;    
    });

    this._data.ctxSelectedAlbum.subscribe((album: IAlbum) => {
      album.started = Boolean(album.started);
      this.selectedAlbum = album;
      this.tabFlows = IpcFrontend.getTabFlows(album.collection);
    });

    this._data.ctxSelectedCollection.subscribe(collection => this.selectedCollection = collection);

    this._datasource.forEach(d => {
      d.ready = false;
      d.loaded = false;
      d.elementRef = null;
      d.isInViewport = false;
      d.position = -1;
    });
    this.differSub = this.service.differ.subscribe((m) => this.computeMediasDimension(this.galleryElement.nativeElement.offsetWidth - 20));
    this.computeMediasDimension(this.galleryElement.nativeElement.offsetWidth - 20);
  }

  ngOnDestroy(): void {
    if(this.differSub) {
      this.differSub.unsubscribe();
    }
  }

  select(event, idx: number) {
    event.stopPropagation();
    this._datasource[idx].position = idx;
    if(this._datasource[idx].loaded && this._datasource[idx].media.type === 'video' && this._datasource[idx].elementRef && !this._datasource[idx].elementRef.paused) {
      this._datasource[idx].elementRef.pause();
    }
    this.service.selection.emit(this._datasource[idx].media);
  }

  onInViewportChange(event: boolean, media: MediaContainer) {
    media.isInViewport = event;
    if(!media.ready && event) {
      media.ready = event;
    }
    if(media.media.type === 'video' && media.loaded) {
      if(event && this.autoplay) {
        media.elementRef.play();
      } else {
        media.elementRef.pause();
      }
    }
  }

  loadMedia(media: MediaContainer, element: any) {
    media.height = element.videoHeight ? element.videoHeight : element.height;
    media.width = element.videoWidth ? element.videoWidth : element.width;
    media.elementRef = element;
    this.computeMediasDimension(this.galleryElement.nativeElement.offsetWidth - 20);
    media.loaded = true;
  }

  onResize() {
    this.computeMediasDimension(this.galleryElement.nativeElement.offsetWidth - 20);
  }

  onError(mediaContainer: MediaContainer, idx: number) {
    mediaContainer.error = true;
    this.service.error.emit(this._datasource[idx].media);
    this._datasource.splice(idx,1);
  }

  private computeMediasDimension(clientWidth: number) {
    let availableWidth = clientWidth;
    let rowMedia: MediaContainer[] = [];
    let rowcount = 0;
    let totalSpacing = 0;
    for (let idx = 0; idx < this._datasource.length; idx++) {
      const element = this._datasource[idx];
      this.computeMediaRatio(element);
      availableWidth -= element.computedWidth;
      element.position = rowcount;
      element.widthMargin = this._spacing;
      element.heightMargin = this._spacing;
      totalSpacing += this._spacing * 2;
      rowMedia.push(element);
      if(availableWidth <= 0) {
        const widthRatio = (clientWidth + Math.abs(availableWidth) + totalSpacing) / clientWidth;
        for (let i = 0; i < rowMedia.length; i++) {
          const el = rowMedia[i];
          el.computedWidth = el.computedWidth / widthRatio;
          el.computedHeight = el.height / (el.width / el.computedWidth);
          el.widthMargin = el.widthMargin / widthRatio;
          el.heightMargin = el.heightMargin / (el.width / el.computedWidth);
        }
        rowMedia = [];
        totalSpacing = 0;
        availableWidth = clientWidth;
        rowcount++;
      }
    }
  }

  private computeMediaRatio(element: MediaContainer) {
    element.computedHeight = this._prefHeight;
    element.computedWidth = element.width / (element.height / element.computedHeight);
  }

  getMediaHeight(media: MediaContainer) {
    if(media.loaded) {
      return media.computedHeight;
    } else {
      return this._prefHeight;
    }
  }

  getMediaWidth(media: MediaContainer) {
    if(media.loaded) {
      return media.computedWidth;
    } else {
      return this._prefHeight;
    }
  }

  /**
   * Display a picture's metadata
   * @param index Index of the picture within the array
   */
  openPictureInformation(index: number) {
    let previewList = IpcFrontend.getPreviewFlowPictures(this.selectedAlbum.album);

    this._dialog.open(DialogPictureInfoComponent, { 
      data: 
        { album: previewList[index] }
    });
  }

  /**
   * Delete a picture from an album
   * @param index Index of the picture within the array
   */
  deletePicture(index: number) {
    let previewList: IPreview[] = IpcFrontend.getPreviewFlowPictures(this.selectedAlbum.album);
    let baseList: IBase[] = IpcFrontend.getBaseFlowPictures(this.selectedAlbum.album);

    // Picture deletion dialog
    this._dialog.open(DialogPictureDeleteComponent, { 
      data: { 
        picture: previewList[index],
        flow: this.selectedFlow 
      }
    }).afterClosed().subscribe(confirmed => {
      // Only delete pictures on confirmation
      if(confirmed) {
        IpcFrontend.favoriteFlowDeletePicture(previewList[index].preview);
        IpcFrontend.previewFlowDeletePicture(previewList[index].preview);
        IpcFrontend.baseFlowDeletePicture(baseList[index].base);

        // Remove the picture from the datasource
        if (index > -1) {
          this._datasource.splice(index, 1);
        }

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

    if(this.datasource[index].media.display.favorited) {
      this.datasource[index].media.display.favorited = false;

      IpcFrontend.updateFavorited(this.datasource[index].media.display.preview, false);
      IpcFrontend.deleteFavoriteWhereBase(pictures[index].base);
    } else {
      this.datasource[index].media.display.favorited = true;

      IpcFrontend.updateFavorited(this.datasource[index].media.display.preview, true);
      let x: IBase = { collection: this.selectedCollection, album: this.selectedAlbum.album, preview: pictures[index].preview, base: pictures[index].base}
      IpcFrontend.saveFavorite(x);
    }
  }

  /**
   * Open a favorited picture within a post processing editing program
   * @param index Index of the picture within the array
   */
  openPictureInPostProcessingProgram(index: number) {
    let settings: ISettings = IpcFrontend.getSettings();

    Helper.ExternalProgram(settings.sofwarePostProcessing, this.datasource[index].media.display.base, this._snack);
  }
}
