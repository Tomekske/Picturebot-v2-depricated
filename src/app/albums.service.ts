import { Injectable } from '@angular/core';
import { ElectronService } from './core/services/electron/electron.service';
import { IAlbum } from './../../shared/database/interfaces';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {
  private albums: string[] = [];
  private source = new Subject<string[]>();
  observable$ = this.source.asObservable();

  private collection: string;

  constructor(private electron: ElectronService) { }

  setCollection(collection) {
    this.collection = collection;
    this.source.next(collection);
  }

  getAlbums(): string[] {
    this.albums = [];
    this.electron.ipcRenderer.sendSync("get-albums", this.collection).forEach((album: IAlbum) => {
      console.log(`ALBUM: ${album.album}`);
      this.albums.push(album.album);
    });
    
    return this.albums;
  }
}
