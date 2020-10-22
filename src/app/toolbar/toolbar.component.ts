import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElectronService } from '../core/services/electron/electron.service';
import { IAlbum, IBase, ICollection, IFlow, IPreview } from '../../../shared/database/interfaces';
import { Logger } from '../../../logger';
import { DataService } from '../data.service';
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

  constructor(private _electron: ElectronService, private _data: DataService, private _router: Router) { }

  ngOnInit(): void {
    this.isStarted = true;
    console.log(this.collections);
  }

  ngAfterViewInit() {
    console.log('afteeer');

    this._electron.ipcRenderer.sendSync("get-collections").forEach((collection: ICollection) => {
      this.collections.push(collection.collection);
    });
  }

  // Selecting item within the selection component
  selectedCollectionEvent($event) {
    // this.collections = [];
    console.log(`SELECTED: ${this.selectedCollection}`);
    let selectedAlbum = this._electron.ipcRenderer.sendSync("get-single-album", this.selectedCollection);
    this._data.selectedCollection = this.selectedCollection;
    this.isStarted = Boolean(Number(selectedAlbum.started));
    console.log(`BAAAAAAAAAAL: ${this.isStarted}`);

    this._router.navigateByUrl('/main');
  }

  startClickEvent() {
    console.log(this._data.selectedAlbum);

    let album: IAlbum = this._data.selectedAlbum;
    album.collection = this._data.selectedCollection;
    
    this._electron.ipcRenderer.sendSync("update-album-started", this._data.selectedAlbum);
    
    // value must be set to true
    this._data.setAlbumStarted(this._data.selectedAlbum.album, true);
    
    // renaming algo
    let x: IFlow = this._electron.ipcRenderer.sendSync("get-started-flow", this.selectedCollection);


    for (const [key, value] of Object.entries(x)) {
      let counter = 0;
      //console.log(`${key}: ${value}`);
      if(value == x.base) {
        this._electron.ipcRenderer.sendSync("get-baseFLow-pictures", album.album).forEach((pic: IBase) => {
          let dirname = this._electron.path.basename(pic.album);
          let destination = this._electron.path.join(pic.album, value, `${dirname.split(" ")[0]}_${dirname.split(" ")[1]}_${(++counter).toString().padStart(5, '0')}${this._electron.path.extname(pic.destination)}`);
          console.log(`${value}: ${pic.destination} - ${destination}`);

          this._electron.fs.rename(pic.destination, destination, function(err) {
              if ( err ) console.log('ERROR: ' + err);
          });

          let update = { name: this._electron.path.basename(destination), destination: pic.destination, album: pic.album, dest: destination};
          console.log(update);

          this._electron.ipcRenderer.sendSync("update-name-baseFlow", update);
        });
      }

      else if(value == x.preview) {
        this._electron.ipcRenderer.sendSync("get-previewFLow-pictures", album.album).forEach((pic: IPreview) => {
          let dirname = this._electron.path.basename(pic.album);
          let destination = this._electron.path.join(pic.album, value, `${dirname.split(" ")[0]}_${dirname.split(" ")[1]}_${(++counter).toString().padStart(5, '0')}${this._electron.path.extname(pic.preview)}`);
          console.log(`${value}: ${pic.preview} - ${destination}`);

          this._electron.fs.rename(pic.preview, destination, function(err) {
            if ( err ) console.log('ERROR: ' + err);
          });

          let update = { name: this._electron.path.basename(destination), destination: pic.preview, album: pic.album, dest: destination};
          console.log(update);

          this._electron.ipcRenderer.sendSync("update-name-previewFlow", update);
        });
      }
    }
  }

  // Opening selection box
  selectionClickEvent() {
    console.log(`CNT: ${this.collections.length}`);
    //this.collections = [];

    if(this.collections.length != 0) {
      this.collections = [];
    }

    this._electron.ipcRenderer.sendSync("get-collections").forEach((collection: ICollection) => {
      this.collections.push(collection.collection);
    });  
  }
}
