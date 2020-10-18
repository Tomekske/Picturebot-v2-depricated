import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';
import { DataService } from '../data.service';
import { IAlbum } from '../../../shared/database/interfaces';

@Component({
  selector: 'app-shoot-selector',
  templateUrl: './shoot-selector.component.html',
  styleUrls: ['./shoot-selector.component.css']
})
export class ShootSelectorComponent implements OnInit {
  a: IAlbum[] = [];
  albums: IAlbum[] = [];
  selected: string;
  sel: string;
  //selectedAlbum: string;

  constructor(private _electron: ElectronService, private _data: DataService) { }

  ngOnInit(): void {
    this._data.ctxCollection.subscribe((collection) => {
      console.warn(collection);
      this.albums = [];
      this.albums = this._electron.ipcRenderer.sendSync("get-albums", collection);
      console.log(this.albums);
      
      this._data.albumsInCollection = this.albums;

      // if(this.albums.length != 0) {
      //   this.selected = this.albums[0].album;
      //   this.selectedAlbum(this.albums[0]);
      // }

    });
  }

  selectedAlbumEvent($event) {
    let album: IAlbum = $event.option['_value'];
    this.selected = album.album;
    console.log(`SELECTED ALBUM: ${album.album}`);
    this._data.selectedAlbum = album;
  }
}
