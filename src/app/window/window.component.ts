import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';
import { IAlbum, IBase, IFlow } from '../../../shared/database/interfaces';
import { DataService } from '../data.service';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css'],
})

export class WindowComponent implements OnInit {
  previewList: string[] = [];
  base64List: string[] = [];
  selectedFlow: string;
  displayFlows: IFlow;
  flows: string[] = [];
  ff: IFlow;
  album: IAlbum;

  constructor(private electron: ElectronService, private _data: DataService) { }

  ngOnInit(): void {
    this._data.ctxSelectedAlbum.subscribe((album: IAlbum) => {
      this.album = album;
        console.log("JOEPIEEEE");
        console.log(album);
        console.log(this._data.selectedCollection);

        this.flows = [];
        // //this.selectedFlow = flow;
        // console.log(`SELECTED ALBUM - windoooow: ${this.album.album}`);
        this.ff = this.electron.ipcRenderer.sendSync("get-flows", this._data.selectedCollection);
        console.log(this.ff);
        this._data.flowsInCollection = this.ff;
        this.flows.push(this.ff.preview);
        this.flows.push(this.ff.edited);
        this.flows.push(this.ff.socialMedia);
    });
  }

  base64_encode(url) {
    let base64 = this.electron.fs.readFileSync(url).toString('base64');
    return `data:image/jpg;base64,${ base64 }`
  }


  selectedFlowEvent(event) {
    this.selectedFlow = event.tab.textLabel;
    console.log(event);
    console.log(event.tab.textLabel);

      if(this.selectedFlow == this.ff.preview) {
        console.log("previewwwwwwwwwwwwwwwwwwwwwwwwwwwww");
        this._data.selectedFlow = this.selectedFlow;

        this.electron.ipcRenderer.sendSync("get-preview-pictures", this.album.album).forEach((picture: IBase) => {
          this.base64List.push(this.base64_encode(picture.destination));
        });

      } else if(this.selectedFlow == this.ff.edited) {
        this.base64List = [];
        console.log("editedddddddddddddddddddddddd");
      } else if(this.selectedFlow == this.ff.socialMedia) {
        this.base64List = [];
        console.log("socialMediaaaaaaaaaaaaaaaaaaaaaaaa");
      } else {
        this.base64List = [];
        console.log("OEEEEEEEEEEEEEEEEEPS");
      }
  }
}
