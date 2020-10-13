import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';
import { AlbumsService } from '../albums.service';
import { PicturesService } from '../pictures.service';

interface IPicture {
  album: string,
  name: string,
}

@Component({
  selector: 'app-shoot-selector',
  templateUrl: './shoot-selector.component.html',
  styleUrls: ['./shoot-selector.component.css']
})
export class ShootSelectorComponent implements OnInit {
  a: IPicture[] = [];

  constructor(private electron: ElectronService, private albums: AlbumsService, private preview: PicturesService) { }

  ngOnInit(): void {
    console.log("ngOnInit shooooooooot");
    //this.albums.getAlbums();
    this.albums.observable$.subscribe(aa => {
      this.a = [];
      this.albums.getAlbums().forEach(album => {
        this.a.push({album: album, name:this.electron.path.basename(album)});
      });
    });


    // this.a = this.albums.getAlbums();
    // console.log(this.a);
  }

  selectedAlbum(album: IPicture) {
    console.log(`SELECTED ALBUM: ${album}`);
    this.preview.setPreviewPictures(album.album);
  }
}
