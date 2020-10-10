import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElectronService } from '../core/services/electron/electron.service';
import { ILibrary } from '../../../shared/database/interfaces';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  libraryForm: FormGroup;

  isShowLibrary: boolean = false;
  @Output() sendIsShowLibrary = new EventEmitter<boolean>();

  constructor(private electron: ElectronService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.libraryForm = this.fb.group({
      name: '',
      base: '',
      path: ''
    });
  }

  saveLibrary() {
    let x: ILibrary = this.libraryForm.value;
    let y: ILibrary = {name: x.name, base: x.base, library: this.electron.path.join(x.base, x.name)};
    
    console.log("Library Saved");
    console.log(this.libraryForm.value);
    
    this.electron.ipcRenderer.send("save-library", y);

    this.isShowLibrary = !this.isShowLibrary;
    this.sendIsShowLibrary.emit(this.isShowLibrary);
  }
}
