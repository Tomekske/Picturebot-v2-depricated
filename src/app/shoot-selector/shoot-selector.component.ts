import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';
import { AlbumsService } from '../albums.service';

@Component({
  selector: 'app-shoot-selector',
  templateUrl: './shoot-selector.component.html',
  styleUrls: ['./shoot-selector.component.css']
})
export class ShootSelectorComponent implements OnInit {
  a: string[] = [];

  constructor(private electron: ElectronService, private albums: AlbumsService) { }

  ngOnInit(): void {
    console.log("ngOnInit shooooooooot");
    this.albums.getAlbums();
    this.albums.observable$.subscribe(aa => {
      this.a = [];
      this.albums.getAlbums().forEach(alb => {
        console.log(`ALBUUUUM: ${alb}`);
        this.a.push
      });

      this.a = this.albums.getAlbums();
    });


    // this.a = this.albums.getAlbums();
    // console.log(this.a);
  }
}
