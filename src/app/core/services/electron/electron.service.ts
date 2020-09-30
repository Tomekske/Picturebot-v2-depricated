import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote, BrowserWindow } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as bodyParser  from 'body-parser';
import * as db from 'better-sqlite3';
import * as path from 'path';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  window: BrowserWindow;
  bodyParser: typeof bodyParser;
  db: typeof db;
  path: typeof path;

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.window = window.require('electron').remote.getCurrentWindow();
      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.bodyParser = window.require('body-parser');
      this.db = window.require('better-sqlite3');
      this.path = window.require('path');
    }
  }
}
