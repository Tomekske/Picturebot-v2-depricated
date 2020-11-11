import { app, BrowserWindow, screen, ipcMain, remote } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';
import * as cp from 'child_process';

import { Logger } from './shared/logger/logger';
import { DbSettings } from './shared/database/dbSettings';
import { DbLibrary } from './shared/database/dbLibrary';
import { ILibrary, ISettings, ICollection, IAlbum, IFlow, IBase, IPreview } from './shared/database/interfaces';
import { DbCollection } from './shared/database/dbCollection';
import { DbAlbum } from './shared/database/dbAlbum';
import { DbBaseFlow } from './shared/database/dbBaseFlow';
import { Updater } from './shared/updater/updater';
import { DbBackupFlow } from './shared/database/dbBackupFlow';
import { DbPreviewFlow } from './shared/database/dbPreviewFlow';
import { Helper } from './shared/helper/helper';
import { IpcBackend } from './shared/ipc/backend';

let win: BrowserWindow = null;

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      webSecurity: false
    },
  });

  if (serve) {

    win.webContents.openDevTools();

    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');

  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: false
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  app.allowRendererProcessReuse = true;
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    Logger.Log().debug('ACIVATED'); 
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  // Check for new updates
  checkForUpdates();

  // Ipc functions
  ipcAlbums();
  ipcCollections();
  ipcFlows();
  ipcLibraries();
  ipcPictures();
  ipcSettings();
} catch (e) {
  // Catch Error
  // throw e;
  //logger.Log().debug(e);

}

/**
 * Function to encapsulate ipc collections
 */
function ipcCollections() {
  IpcBackend.getCollections();
  IpcBackend.saveCollection();
}

/**
 * Function to encapsulate ipc flows
 */
function ipcFlows() {
  IpcBackend.getTabFlows();
  IpcBackend.getStartingFlows();
  IpcBackend.updateBaseFlowName();
  IpcBackend.updatePreviewFlowName();
}

/**
 * Function to encapsulate ipc libraries
 */
function ipcLibraries() {
  IpcBackend.saveLibrary();
  IpcBackend.getLibraries();
}

/**
 * Function to encapsulate ipc pictures
 */
function ipcPictures() {
  IpcBackend.getBaseFlowPictures();
  IpcBackend.getPreviewFlowPictures();
  IpcBackend.savePictures();
}

/**
 * Function to encapsulate ipc albums
 */
function ipcAlbums() {
  IpcBackend.updateAlbumIsOrganized();
  IpcBackend.getAlbums();
}

/**
 * Function to encapsulate ipc settings
 */
function ipcSettings() {
  IpcBackend.saveSettings();
  IpcBackend.getSettings();
  IpcBackend.checkSettingsEmpty();
}

/**
 * Function to check for application updates
 */
function checkForUpdates() {
  const updater = new Updater();

  updater.checkForUpdates();
  updater.isUpdateAvailable();
  updater.isUpdateNotAvailable();
  updater.error();
  updater.downloadProgress();
  updater.updateDownloaded();
}
