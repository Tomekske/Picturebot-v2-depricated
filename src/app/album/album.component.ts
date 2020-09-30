import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElectronService } from '../core/services/electron/electron.service';
import { IAlbum, IBase } from '../../../shared/database/interfaces';
import { Logger } from '../../../logger';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
  albumForm: FormGroup;
  collections = [];
  
  constructor(private electron: ElectronService, private fb: FormBuilder) { }
  files: File[] = [];
  pics: IBase[] = [];

  ngOnInit(): void {
    this.albumForm = this.fb.group({
      collection: '',
      name: '',
      date: ''
    });

    this.electron.ipcRenderer.sendSync("get-collections").forEach(collection => {
      console.log(collection.path);
      this.collections.push(collection.path);
    });
  }

  saveAlbum() {
    let x: IAlbum = this.albumForm.value;
    let y: IAlbum = { collection: x.collection, name: x.name, date: x.date, path: this.electron.path.join(x.collection, `${x.name} ${x.date}`)};

    this.files.forEach((element) => {
     console.log(element.name);
     this.pics.push({source: element.path, name: element.name});
    });

    this.electron.ipcRenderer.sendSync("save-pictures", this.pics, y);
  }

	onSelect(event) {
		console.log(event);
    this.files.push(...event.addedFiles);
    //this.files.push(event.addedFiles);
    console.log(`Added Array: ${this.files.length}`);
    console.log(this.files);
	}

	onRemove(event) {
		console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
    console.log(`Removed Array: ${this.files.length}`);
    console.log(this.files);
	}
}
