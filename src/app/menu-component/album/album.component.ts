import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElectronService } from '../../core/services/electron/electron.service';
import { IAlbum, IBase, ICollection, ISettings } from '../../../../shared/database/interfaces';
import { ICollectionSelector, IFileTypes } from '../../../../shared/helper/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Helper } from '../../../../shared/helper/helper';
import { DataService } from 'app/services/data.service';
import { Stats } from 'original-fs';
import { IpcFrontend } from '../../../../shared/ipc/frontend';
import { Regex, Message, MenuText, FileTypes } from '../../../../shared/helper/enums';
import moment from 'moment';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
  albumForm: FormGroup;
  collections = [];
  hasPictures: boolean;
  message = Message;
  isRawExtension: boolean;
  collectionSelector: ICollectionSelector[] = [];

  constructor(private electron: ElectronService, private fb: FormBuilder, private _snack: MatSnackBar, private _data: DataService, private _router: Router) { }
  picturesDropzone: File[] = [];
  pictures: IBase[] = [];
  hashedPictures: IBase[] = [];
  settings: ISettings;
  date: Date;

  /**
   * On init lifecycle hook
   */
  ngOnInit(): void {
    this._data.IsPictures = false;
    this._data.MenuText = MenuText.album;
    this.settings = IpcFrontend.getSettings();

    this.collectionSelector = IpcFrontend.collectionsSelector();

    let defaultCollection: string = (this.collectionSelector.length == 0) ? "" : this.collectionSelector[0].collections[0].fullPath;

    this.albumForm = this.fb.group({
      collection: defaultCollection,
      name: ['', [Validators.required, Validators.pattern(Regex.NameWhiteSpaces)]],
      date: ['', Validators.required]
    });
  }

  /**
   * Method that simplifies getting the form controls 
   */
  get form() {
    return this.albumForm.controls;
  }

  /**
   * Function to save an album to the database
   */
  saveAlbum() {
    let dropzone: IAlbum = this.albumForm.value;
    let formatedDate = Helper.formatDate(dropzone.date);

    // Return on validation errors
    if (this.albumForm.invalid || this.picturesDropzone.length == 0 || !this.isRawExtension || !this.settings) {
      this.hasPictures = this.picturesDropzone.length == 0 ? false : true;
      this._snack.open(`Input values are invalid!`, "Dismiss", {
        duration: 4000,
        horizontalPosition: "end",
        panelClass: "snackbar-id"
      });

      return;
    }

    // Create album object
    let album: IAlbum = {
      collection: dropzone.collection,
      name: dropzone.name,
      date: formatedDate,
      album: this.electron.path.join(dropzone.collection, `${dropzone.name} ${formatedDate}`),
      started: 0,
      raw: 1
    };

    this.sortPictures();

    let that = this;
    this.pictures.forEach((picture, i) => {
      const newFilename = Helper.renameHashedPicture(picture, i + 1, 5);
      that.hashedPictures.push({ source: picture.source, name: newFilename, hashed: newFilename, date: picture.date, time: picture.time });
    });

    IpcFrontend.savePictures(this.hashedPictures, album);
    this._data.isAlbumSelectorVisible = true;

    this._snack.open(`Album '${album.album}' saved!`, "Dismiss", {
      duration: 4000,
      horizontalPosition: "end"
    });

    this._data.isAlbumSaved = true;
    this._router.navigateByUrl('/main');
  }

  /**
   * Function to add pictures to an from the dropzone
   * @param event Event parameter
   */
  onSelect(event) {
    this.hasPictures = true;
    this.picturesDropzone.push(...event.addedFiles);

    event.addedFiles.forEach(pictures => {
      let extension = this.electron.path.extname(pictures.name);
      this.isRawExtension = FileTypes.Raw.includes(extension);
    });

    this.sortPictures();
    this.date = moment(this.pictures[0].date, "DD/MM/YYYY").toDate();
  }

  /**
   * Function to remove pictures from the dropzone array
   * @param event Event parameter
   */
  onRemove(event) {
    this.picturesDropzone.splice(this.picturesDropzone.indexOf(event), 1);

    this.sortPictures();
    this.date = moment(this.pictures[0].date, "DD/MM/YYYY").toDate();

    this.hasPictures = this.picturesDropzone.length == 0 ? false : true;

    if (this.picturesDropzone.length == 0) {
      this.date = null;
    }
  }

  /**
   * Clear the input value of an control element
   * @param control Control element name
   */
  clearInput(control: string) {
    this.albumForm.controls[control].reset();
  }

  /**
   * Remove all pictures from the dropzone
   */
  clearDropzone() {
    this.date = null;
    this.picturesDropzone = [];
  }

  /**
   * Sort all pictures by date
   */
  sortPictures() {
    this.pictures = [];
    
    // Iterate over all the pictures within the dropzone
    this.picturesDropzone.forEach((element) => {
      // Obtain picture information
      const stats: Stats = this.electron.fs.statSync(element.path);
      let createdDate: string = Helper.formatDate(stats.mtime.toISOString());
      let createdTime: string = Helper.formatTime(stats.mtime.toISOString());

      this.pictures.push({ source: element.path, name: element.name, modification: stats.mtime, date: createdDate, time: createdTime });
    });

    this.pictures.sort(Helper.sortDateTimes);
  }
}
