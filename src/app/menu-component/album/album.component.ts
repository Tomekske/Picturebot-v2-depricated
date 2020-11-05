import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElectronService } from '../../core/services/electron/electron.service';
import { IAlbum, IBase, ICollection } from '../../../../shared/database/interfaces';
import { Logger } from '../../../../shared/logger/logger';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Helper } from '../../../../shared/helper/helper';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
  albumForm: FormGroup;
  collections = [];

  constructor(private electron: ElectronService, private fb: FormBuilder, private _snack: MatSnackBar, private _data: DataService, private _router: Router) { }
  picturesDropzone: File[] = [];
  pictures: IBase[] = [];
  hashedPictures: IBase[] = [];

  /**
   * On init lifecycle hook
   */
  ngOnInit(): void {
    this.albumForm = this.fb.group({
      collection: '',
      name: '',
      date: ''
    });

    this.electron.ipcRenderer.sendSync("get-collections").forEach((collection: ICollection) => {
      this.collections.push(collection.collection);
    });

    this._data.isAlbumSelectorVisible = false;
  }

  /**
   * Function to save an album to the database
   */
  saveAlbum() {   
    let dropzone: IAlbum = this.albumForm.value;

    Helper.formatDate(dropzone.date);

    // Create album object
    let album: IAlbum = { 
      collection: dropzone.collection, 
      name: dropzone.name, 
      date: Helper.formatDate(dropzone.date), 
      album: this.electron.path.join(dropzone.collection, `${dropzone.name} ${Helper.formatDate(dropzone.date)}`), 
      started: 0
    };

    // Iterate over all the pictures within the dropzone
    this.picturesDropzone.forEach((element) => {
      // Obtain picture information
     const stats = this.electron.fs.statSync(element.path);

     this.pictures.push({source: element.path, name: element.name, modification: stats.mtime});
    });

    this.pictures.sort(Helper.sortDateTimes);

    let that = this;
    this.pictures.forEach((picture, i) => {
      const newFilename = Helper.renameHashedPicture(picture, i + 1, 5);
      that.hashedPictures.push({source: picture.source, name: picture.name, hashed: newFilename});
    });

    this.electron.ipcRenderer.sendSync("save-pictures", this.hashedPictures, album);
    
    this._snack.open(`Album '${album.album}' saved!`, "Dismiss", {
      duration: 4000,
      horizontalPosition: "end"
    });
    
    this._router.navigateByUrl('/main');
  }

  /**
   * Function to add pictures to an from the dropzone
   * @param event Event parameter
   */
	onSelect(event) {
    this.picturesDropzone.push(...event.addedFiles);
	}

  /**
   * Function to remove pictures from the dropzone array
   * @param event Event parameter
   */
	onRemove(event) {
    this.picturesDropzone.splice(this.picturesDropzone.indexOf(event), 1);
  }
}
