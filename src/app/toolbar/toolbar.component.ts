import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElectronService } from '../core/services/electron/electron.service';
import { IAlbum, IBase, ICollection } from '../../../shared/database/interfaces';
import { Logger } from '../../../logger';
import { AlbumsService } from '../albums.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  collections = [];
  collection: string;

  constructor(private electron: ElectronService, private albums: AlbumsService) { }

  ngOnInit(): void {
    console.log("CHOOOOOSE");

  }

  @HostListener("click")
  click() {
    this.collections = [];
    console.log("User Click using Host Listener");
    this.electron.ipcRenderer.sendSync("get-collections").forEach((collection: ICollection) => {
      this.collections.push(collection.collection);
    });
  }

  @HostListener("change")
  change() {
    this.collections = [];
    console.log("CHANGEEED");


    console.log(`SELECTED: ${this.collection}`);
    this.albums.setCollection(this.collection);
    // this.electron.ipcRenderer.sendSync("get-albums", this.collection).forEach((album: IAlbum) => {
    //   console.log(`ALBUM: ${album.album}`);
    //   this.albums.push(album.album);
    // });
  }
}
