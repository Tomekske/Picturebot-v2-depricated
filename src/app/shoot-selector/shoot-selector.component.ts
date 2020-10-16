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

  constructor(private _electron: ElectronService, private _data: DataService) { }

  ngOnInit(): void {
    this._data.ctxCollection.subscribe((collection) => {
      console.warn(collection);
      this.albums = [];
      this.albums = this._electron.ipcRenderer.sendSync("get-albums", collection);
      console.log(this.albums);
      
      this._data.albumsInCollection = this.albums;

      if(this.albums.length != 0) {
        this.selected = this.albums[0].album;
        this.selectedAlbum(this.albums[0]);
      }

    });
  }

  selectedAlbum(album: IAlbum) {
    console.log(`SELECTED ALBUM - SHOOT SELECTOR: ${album.album}`);
    this.selected = album.album;
    this._data.selectedAlbum = album;
  }
}
