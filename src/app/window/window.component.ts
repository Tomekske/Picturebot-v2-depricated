import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';
import { IAlbum, IBase, IFlow } from '../../../shared/database/interfaces';
import { DataService } from '../data.service';

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

  constructor(private electron: ElectronService, private _data: DataService) { }

  ngOnInit(): void {
    this._data.ctxSelectedFlow.subscribe((flow) => {
      this.selectedFlow = flow;
      let ff: IFlow = this._data.flowsInCollection;
      let album: IAlbum = this._data.selectedAlbum;



      if(this.selectedFlow == ff.preview) {
        console.log("previewwwwwwwwwwwwwwwwwwwwwwwwwwwww");
        // this.preview.getPreviewPictures().forEach((pre: IBase) => {
        //   console.log(pre);
        //   this.base64List.push(this.base64_encode(pre.destination));
        // });

        this.electron.ipcRenderer.sendSync("get-preview-pictures", album.album).forEach((picture: IBase) => {
          //this.previewPictures.push(picture);
          this.base64List.push(this.base64_encode(picture.destination));
        });

      } else if(this.selectedFlow == ff.edited) {
        this.base64List = [];
        console.log("editedddddddddddddddddddddddd");
      } else if(this.selectedFlow == ff.socialMedia) {
        this.base64List = [];
        console.log("socialMediaaaaaaaaaaaaaaaaaaaaaaaa");
      } else {
        this.base64List = [];
        console.log("OEEEEEEEEEEEEEEEEEPS");
      }

      // this.preview.getPreviewPictures().forEach((pre: IBase) => {
      // console.log(pre);
      // this.base64List.push(this.base64_encode(pre.destination));
      // });

    });


    // console.log("111111111111111111111111");
    // // // this.albumService.oo$.subscribe(bb => {
        
    // // //   this.selectedFlow = this.albumService.getFlow();
    // // //   console.log(`FLOOOW: ${this.selectedFlow}`);
    // // // })
    // this.selectedFlow = this.albumService.getFlow();
    // console.log("222222222222222222222222222222");
    // console.error(`FLOOOW: ${this.selectedFlow}`);
    // console.log("33333333333333333333333333333333333");
    // this.displayFlows = this.albumService.getFlows();
    // console.log("44444444444444444444444444444444444444");

    // console.log(this.displayFlows);

    // console.log("55555555555555555555555555555555");

    // this.albumService.observable$.subscribe(bb => {
        
    //   this.displayFlows = this.albumService.getFlows();
    //   console.log(`SELECTEDFLOOOW: ${this.selectedFlow}`);
    //   console.log(this.displayFlows.preview);
    //   console.log(this.displayFlows);
    // });    


    // this.preview.observable$.subscribe(aa => {
    //   this.previewList = [];
    //   this.base64List = [];
    
    //   console.warn(this.displayFlows);

      // if(this.selectedFlow == this.displayFlows.preview) {
      //   console.log("previewwwwwwwwwwwwwwwwwwwwwwwwwwwww");

      // } else if(this.selectedFlow == this.displayFlows.edited) {
      //   console.log("editedddddddddddddddddddddddd");
      // } else if(this.selectedFlow == this.displayFlows.socialMedia) {
      //   console.log("socialMediaaaaaaaaaaaaaaaaaaaaaaaa");

      // } else {
      //   console.log("OEEEEEEEEEEEEEEEEEPS");
      // }

    //   this.preview.getPreviewPictures().forEach((pre: IBase) => {
    //     console.log(pre);
    //     this.base64List.push(this.base64_encode(pre.destination));
    //   });
    // });



  }

  base64_encode(url) {
    let base64 = this.electron.fs.readFileSync(url).toString('base64');
    return `data:image/jpg;base64,${ base64 }`
  }
}
