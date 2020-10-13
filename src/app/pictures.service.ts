import { Injectable } from '@angular/core';
import { ElectronService } from './core/services/electron/electron.service';
import { IBase } from './../../shared/database/interfaces';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PicturesService {
  private previewPictures: IBase[] = [];
  private source = new Subject<IBase[]>();
  observable$ = this.source.asObservable();

  private previewAlbum: string;

  constructor(private electron: ElectronService) { }

  setPreviewPictures(album) {
    this.previewAlbum = album;
    this.source.next(album);
  }

  getPreviewPictures(): IBase[] {
    this.previewPictures = [];
    this.electron.ipcRenderer.sendSync("get-preview-pictures", this.previewAlbum).forEach((picture: IBase) => {
      this.previewPictures.push(picture);
    });

    return this.previewPictures;
  }
}
