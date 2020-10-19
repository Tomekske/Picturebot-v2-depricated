import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElectronService } from '../core/services/electron/electron.service';
import { ICollection, ILibrary } from '../../../shared/database/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  collectionForm: FormGroup;
  libraries: any = [];

  constructor(private electron: ElectronService, private fb: FormBuilder, private _snack: MatSnackBar, private _router: Router) { }

  ngOnInit(): void {
    this.collectionForm = this.fb.group({
      library: '',
      name: '',
      backup: '',
      base: '',
      preview: '',
      files: '',
      edited: '',
      socialMedia: '',
      selection: ''
    });

    this.electron.ipcRenderer.sendSync("get-libraries").forEach((library: ILibrary) => {
      console.log(library.library);
      this.libraries.push(library.library);
    });
  }

  saveCollection() {
    let x: ICollection = this.collectionForm.value;
    let y: ICollection = { library: x.library, name: x.name, backup: x.backup, base: x.base,
      preview: x.preview, files: x.files, edited: x.edited, socialMedia: x.socialMedia,
      selection: x.selection, collection: this.electron.path.join(x.library, x.name)
    };

    this.electron.ipcRenderer.send("save-collection", y);
    
    this._snack.open(`Collection '${this.electron.path.join(x.library, x.name)}' saved!`, "Dismiss", {
      duration: 2000,
      horizontalPosition: "end"
    });
    this._router.navigateByUrl('/main');
  }
}
