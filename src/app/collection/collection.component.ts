import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElectronService } from '../core/services/electron/electron.service';
import { ICollection } from '../../../shared/database/interfaces';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  collectionForm: FormGroup;
  libraries: any = [];
  constructor(private electron: ElectronService, private fb: FormBuilder) { }

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

    this.electron.ipcRenderer.sendSync("get-libraries").forEach(library => {
      console.log(library.path);
      this.libraries.push(library.path);
    });
  }

  saveCollection() {
    let x: ICollection = this.collectionForm.value;
    let y: ICollection = { library: x.library, name: x.name, backup: x.backup, base: x.base,
      preview: x.preview, files: x.files, edited: x.edited, socialMedia: x.socialMedia,
      selection: x.selection, path: this.electron.path.join(x.library, x.name)
    };

    this.electron.ipcRenderer.send("save-collection", y);


  }
}
