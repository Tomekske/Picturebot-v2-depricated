import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElectronService } from '../core/services/electron/electron.service';
import { IAlbum, IBase, ICollection } from '../../../shared/database/interfaces';
import { Logger } from '../../../logger';
import * as hasha from 'hasha';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
  albumForm: FormGroup;
  collections = [];
  isShowAlbum: boolean;
  @Output() sendIsShowAlbum = new EventEmitter<boolean>();

  constructor(private electron: ElectronService, private fb: FormBuilder) { }
  files: File[] = [];
  pics: IBase[] = [];
  newpics: IBase[] = [];

  ngOnInit(): void {
    this.albumForm = this.fb.group({
      collection: '',
      name: '',
      date: ''
    });

    this.electron.ipcRenderer.sendSync("get-collections").forEach((collection: ICollection) => {
      console.log(collection.collection);
      this.collections.push(collection.collection);
    });
  }

  saveAlbum() {
    console.log("SAVEEEE");
    let dropzone: IAlbum = this.albumForm.value;
    let y: IAlbum = { collection: dropzone.collection, name: dropzone.name, date: dropzone.date, album: this.electron.path.join(dropzone.collection, `${dropzone.name} ${dropzone.date}`)};

    this.files.forEach((element) => {
     const stats = this.electron.fs.statSync(element.path);
     this.pics.push({source: element.path, name: element.name, modification: stats.mtime});
    });

    this.pics.sort(this.compare);

    let that = this;
    this.pics.forEach((e, i) => {
      const hash = hasha.fromFileSync(e.source).substring(0, 10);
      const hasedName = `pb_${(i + 1).toString().padStart(5, '0')}_${hash}${this.electron.path.extname(e.name)}`;
      console.log(`hassssh: ${hash}`);
      that.newpics.push({source: e.source, name: e.name, hashed: hasedName});
      console.log(`AMOUNT PICS333333: ${this.newpics.length}`);
    });

    this.electron.ipcRenderer.sendSync("save-pictures", this.newpics, y);

    this.isShowAlbum = !this.isShowAlbum;
    this.sendIsShowAlbum.emit(this.isShowAlbum);
  }

	onSelect(event) {
		//console.log(event);
    this.files.push(...event.addedFiles);
    //this.files.push(event.addedFiles);
    //console.log(`Added Array: ${this.files.length}`);
    //console.log(this.files);
	}

	onRemove(event) {
		console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
    console.log(`Removed Array: ${this.files.length}`);
    console.log(this.files);
  }
  
  compare(a, b) {
    return a.modification - b.modification;
  }
}
