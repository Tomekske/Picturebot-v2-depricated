import { Component, OnInit, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';
import { AlbumsService } from '../albums.service';
import { PicturesService } from '../pictures.service';

interface IListView {
  text: string,
  id: string
}

@Component({
  selector: 'app-shoot-selector',
  templateUrl: './shoot-selector.component.html',
  styleUrls: ['./shoot-selector.component.css']
})
export class ShootSelectorComponent implements OnInit {
  a: IListView[] = [];
  @ViewChild("listview") element: any;
  constructor(private electron: ElectronService, private albums: AlbumsService, private preview: PicturesService) { }

  ngOnInit(): void {
    console.log("ngOnInit shooooooooot");
    //this.albums.getAlbums();
    this.albums.observable$.subscribe(aa => {
      this.a = [];
      this.albums.getAlbums().forEach(album => {
        this.a.push({id: album, text:this.electron.path.basename(album)});
      });
    });


    // this.a = this.albums.getAlbums();
    // console.log(this.a);
  }
  @HostListener("click")
  selectedAlbum() {
    let album: IListView = this.element.getSelectedItems();

    console.log(album);
    this.preview.setPreviewPictures(album["data"].id);
  }
}
