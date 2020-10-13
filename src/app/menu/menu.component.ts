import { Injectable, Component, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})

/** menu component*/
export class MenuComponent {
/** menu ctor */

  //isShowSettings = new BehaviorSubject<boolean>(true);
  isShowSettings: boolean = true;
  isShowDisplay: boolean = true;
  isShowAlbum: boolean = true;
  isShowCollection: boolean = true;
  isShowLibrary: boolean = true;

  @Output() sendIsShowSettings = new EventEmitter<boolean>();
  @Output() sendIsShowDisplay = new EventEmitter<boolean>();
  @Output() sendIsShowAlbum = new EventEmitter<boolean>();
  @Output() sendIsShowCollection = new EventEmitter<boolean>();
  @Output() sendIsShowLibrary = new EventEmitter<boolean>();

  constructor() { }

  showSettings() {
    this.isShowSettings = !this.isShowSettings;
    this.sendIsShowSettings.emit(this.isShowSettings);
  }

  showWorkspace() {
    console.log("WORKSPAaaaaaaaaaCE");
    this.isShowDisplay = !this.isShowDisplay;
    this.sendIsShowDisplay.emit(this.isShowDisplay);
  }

  showAlbum() {
    console.log("SHOOOOOOOOOOOOT");
    this.isShowAlbum = !this.isShowAlbum;
    this.sendIsShowAlbum.emit(this.isShowAlbum);
  }

  showCollection() {
    console.log("Collection");
    this.isShowCollection = !this.isShowCollection;
    this.sendIsShowCollection.emit(this.isShowCollection);
  }

  showLibrary() {
    console.log("library");
    this.isShowLibrary = !this.isShowLibrary;
    this.sendIsShowLibrary.emit(this.isShowLibrary);
  }
}