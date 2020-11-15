import { createViewChild } from '@angular/compiler/src/core';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ElectronService } from 'app/core/services';
import { DataService } from 'app/services/data.service';
import { ICollection } from '../../../../shared/database/interfaces';
import { Helper } from '../../../../shared/helper/helper';
import { IpcFrontend } from '../../../../shared/ipc/frontend';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  // Construct side bar menu
  menuItems = [
    {
      label: 'Library',
      icon: 'library_books',
      items: [
        {
          label: 'Open',
          icon: 'open_in_new',
          onSelected: () => {
            Helper.openInExplorer(this.selectedCollection.library, this._snack);
          }
        },
        {
          label: 'Add',
          link: '/addLibrary',
          icon: 'add_box'
        }
      ]
    },
    {
      label: 'Collection',
      icon: 'perm_media',
      items: [
        {
          label: 'Open',
          icon: 'open_in_new',
          onSelected: () => {
            Helper.openInExplorer(this.selectedCollection.collection, this._snack);
          }
        },
        {
          label: 'Add',
          link: '/addCollection',
          icon: 'add_box'
        }
      ]
    },
    {
      label: 'Album',
      link: '/addAlbum',
      icon: 'photo_album'
    },
    {
      label: 'Developers Tab',
      icon: 'bug_report',
      items: [
        {
          label: 'Open',
          icon: 'open_in_new',
          onSelected: () => {
            Helper.openFile(this._electron.path.join(Helper.pathMyDocuments(), Helper.app, "app.log"), this._snack);
          }
        },
        {
          label: 'Pictures',
          icon: 'insert_photo',
          onSelected: () => {
            Helper.openInExplorer("D:\\Pictures", this._snack);
          }
        }
      ]
    },
    {
      label: 'Settings',
      link: '/settings',
      icon: 'settings'
    }
  ];
  
  config = {
    paddingAtStart: true,
    interfaceWithRoute: true,
    classname: 'my-custom-class',
    listBackgroundColor: `#333`,
    fontColor: `#fff`,
    backgroundColor: `#333`,
    selectedListFontColor: `#f26`,
    highlightOnSelect: true,
    collapseOnSelect: true,
    useDividers: false,
    rtlLayout: false
};

selectedCollection: ICollection;

  constructor(private _electron: ElectronService, private _data: DataService, private _snack: MatSnackBar) { 
    this._data.ctxSelectedCollection.subscribe(collection => this.selectedCollection = IpcFrontend.getAllCollectionWhereCollection(collection));
  }
}
