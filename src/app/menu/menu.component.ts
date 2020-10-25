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

  appitems = [
    {
      label: 'Library',
      icon: 'library_books',
      items: [
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

  constructor() { }
}
