import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElectronService } from '../core/services/electron/electron.service';
import { IAlbum, IBase, ICollection } from '../../../shared/database/interfaces';
import { Logger } from '../../../logger';
import * as hasha from 'hasha';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
  albumForm: FormGroup;
  collections = [];

  constructor(private electron: ElectronService, private fb: FormBuilder, private _snack: MatSnackBar, private _router: Router) { }
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
      this.collections.push(collection.collection);
    });
  }

  saveAlbum() {   
    let dropzone: IAlbum = this.albumForm.value;
    console.log(dropzone);
    this.formatDate(dropzone.date);

    let y: IAlbum = { collection: dropzone.collection, name: dropzone.name, date: this.formatDate(dropzone.date), album: this.electron.path.join(dropzone.collection, `${dropzone.name} ${this.formatDate(dropzone.date)}`)};
    console.log('yyyyyyyyyyyyyyyyyy');
    console.log(y);
    this.files.forEach((element) => {
     const stats = this.electron.fs.statSync(element.path);
     this.pics.push({source: element.path, name: element.name, modification: stats.mtime});
    });

    this.pics.sort(this.compare);

    let that = this;
    this.pics.forEach((e, i) => {
      const hash = hasha.fromFileSync(e.source).substring(0, 10);
      const hasedName = `pb_${(i + 1).toString().padStart(5, '0')}_${hash}${this.electron.path.extname(e.name)}`;
      that.newpics.push({source: e.source, name: e.name, hashed: hasedName});
    });

    this.electron.ipcRenderer.sendSync("save-pictures", this.newpics, y);
    
    this._snack.open(`Album '${y.album}' saved!`, "Dismiss", {
      duration: 4000,
      horizontalPosition: "end"
    });
    this._router.navigateByUrl('/main');
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

  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-GB', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');
  }
}
