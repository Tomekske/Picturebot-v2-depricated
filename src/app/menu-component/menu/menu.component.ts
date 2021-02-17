import { createViewChild } from '@angular/compiler/src/core';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ElectronService } from 'app/core/services';
import { DataService } from 'app/services/data.service';
import { ICollection, ILegacy } from '../../../../shared/database/interfaces';
import { Helper } from '../../../../shared/helper/helper';
import { App } from '../../../../shared/helper/enums';
import { IpcFrontend } from '../../../../shared/ipc/frontend';
import { MatDialog } from '@angular/material/dialog';
import { DialogImportLegacyComponent } from 'app/dialogs/dialog-import-legacy/dialog-import-legacy.component';
import { Router } from '@angular/router';
import { Location} from '@angular/common'
@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  // Construct side bar menu
  menuItems = [];
  
  config = {
    paddingAtStart: true,
    interfaceWithRoute: true,
    classname: 'menu-id',
    listBackgroundColor: `#333`,
    fontColor: `#fff`,
    backgroundColor: `#333`,
    selectedListFontColor: `#f26`,
    highlightOnSelect: true,
    collapseOnSelect: true,
    useDividers: false,
    rtlLayout: false,
};

selectedCollection: ICollection;

  constructor(private _electron: ElectronService, private _data: DataService, private _snack: MatSnackBar, private _dialog: MatDialog, private _router: Router, private _location: Location) { 
    this.menuItems.push({
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
      label: 'Import legacy',
      icon: 'publish',
      onSelected: () => {
        // Picture deletion dialog
        this._dialog.open(DialogImportLegacyComponent).afterClosed().subscribe((form: ILegacy) => {
          if(form) {
            IpcFrontend.importLegacyAlbum(form);
            this._router.navigateByUrl("/main");
          }   
        });
      }
    },
    {
      label: 'Settings',
      link: '/settings',
      icon: 'settings'
    });


    // Add a developer tab when running a non production version
    if(!Helper.isProduction(false)) {
      this.menuItems.push({
        label: 'Developers Tab',
        icon: 'bug_report',
        items: [
          {
            label: 'Log file',
            icon: 'open_in_new',
            onSelected: () => {
              Helper.openFile(this._electron.path.join(Helper.pathMyDocuments(), App.name, "app.log"), this._snack);
            }
          },
          {
            label: 'Pictures old',
            icon: 'insert_photo',
            onSelected: () => {
              Helper.openInExplorer("D:\\Pictures (old)", this._snack);
            }
          },
          {
            label: 'Debug Pictures',
            icon: 'insert_photo',
            onSelected: () => {
              Helper.openInExplorer("D:\\e2e", this._snack);
            }
          }
        ]
      });  
    }

    this._data.ctxSelectedCollection.subscribe(collection => this.selectedCollection = IpcFrontend.getAllCollectionWhereCollection(collection));
  }
}
