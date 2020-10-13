import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';
import { PicturesService } from '../pictures.service';
import { IBase } from '../../../shared/database/interfaces';
import {DomSanitizer} from '@angular/platform-browser';



@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css'],
})

export class WindowComponent implements OnInit {
  previewList: string[] = [];
  base64List: string[] = [];
  ppp: string;
  constructor(public sanitizer: DomSanitizer, private electron: ElectronService, private preview: PicturesService) { }

  ngOnInit(): void {
    let pic = "D:\\Pictures\\Brussels\\Corona Brussels 14-03-2020\\Preview\\Corona_Brussels_14-03-2020_00001.jpg";
    console.log(pic);
    this.ppp = this.base64_encode(pic);

    this.preview.observable$.subscribe(aa => {
      this.previewList = [];
      this.base64List = [];
      this.preview.getPreviewPictures().forEach((pre: IBase) => {

        this.base64List.push(this.base64_encode(pre.destination));
      });
    });
  }

  base64_encode(url) {
    let base64 = this.electron.fs.readFileSync(url).toString('base64');
    return `data:image/jpg;base64,${ base64 }`
  }
}
