import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElectronService } from '../core/services/electron/electron.service';
import { IAlbum, IBase, ICollection } from '../../../shared/database/interfaces';
import { Logger } from '../../../logger';
import { DataService } from '../data.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  collections = [];
  selectedCollection: string;

  constructor(private electron: ElectronService, private _data: DataService) { }

  ngOnInit(): void {
  }

  @HostListener("click")
  click() {
    this.collections = [];

    this.electron.ipcRenderer.sendSync("get-collections").forEach((collection: ICollection) => {
      this.collections.push(collection.collection);
    });
  }

  selectedCollectionEvent($event) {
    this.collections = [];
    console.log(`SELECTED: ${this.selectedCollection}`);
    this._data.selectedCollection = this.selectedCollection;
  }
}
