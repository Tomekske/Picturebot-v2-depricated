import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';
import { DataService } from '../services/data.service';
import { IAlbum } from '../../../shared/database/interfaces';

@Component({
  selector: 'app-album-selector',
  templateUrl: './album-selector.component.html',
  styleUrls: ['./album-selector.component.css']
})
export class AlbumSelectorComponent implements OnInit {
  albums: IAlbum[] = [];
  selectedAlbum: string;

  constructor(private _electron: ElectronService, private _data: DataService) { }

  /**
   * On init lifecycle hook
   */
  ngOnInit(): void {
    // Observer which listens to selected collection changes
    this._data.ctxCollection.subscribe((collection) => {
      this.albums = this._electron.ipcRenderer.sendSync("get-albums", collection);
      this._data.albumsInCollection = this.albums;

      // Select the first album
      this.setAlbum(this.albums[0]);
    });
  }

  /**
   * Select an album from the list
   * @param $event List events
   */
  selectedAlbumEvent($event) {
    // Get the selected list value
    let album: IAlbum = $event.option['_value'];
    this.setAlbum(album);
  }

  /**
   * Set the selected album
   * @param album Album which will be set
   */
  setAlbum(album: IAlbum) {
    this.selectedAlbum = album.album;
    this._data.selectedAlbum = album;
  }
}
