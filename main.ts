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
  // Get all collections
  ipcMain.on('get-collections', (event, args: ILibrary) => {
    Logger.Log().debug('ipcMain: get-collections');

    // Create database
    const db = new DbCollection();
    
    event.returnValue = db.queryCollections();
  });

  // Save a collection to the database
  ipcMain.on('save-collection', (event, args: ICollection) => {
    Logger.Log().debug('ipcMain: save-collection');

    // Create database
    const db = new DbCollection();

    db.insertRow(args);
    db.dbClose();

    Helper.createDirectory(args.collection);
  });
}

/**
 * Function to encapsulate ipc flows
 */
function ipcFlows() {
  // Get certain flows from the database
  ipcMain.on('get-flows', (event, collection: string) => {
    Logger.Log().debug('ipcMain: get-flows');

    const db = new DbCollection();

    event.returnValue = db.queryFlows(collection);
  });

  // Update the name of the an picture within the base flow 
  ipcMain.on('update-name-baseFlow', (event, update) => {
    Logger.Log().debug('ipcMain: update-name-baseFlow');

    const db = new DbBaseFlow();

    db.updateName(update);
    db.updateDestination(update);
    db.dbClose();
    
    event.returnValue = "";
  });
  
  // Update the name of the an picture within the preview flow 
  ipcMain.on('update-name-previewFlow', (event, update) => {
    Logger.Log().debug('ipcMain: update-name-previewFlow');

    const db = new DbPreviewFlow();

    db.updateName(update);
    db.updateDestination(update);
    db.dbClose();
    
    event.returnValue = "";
  });

  // Get the preview and base flow from a certain collection
  ipcMain.on('get-started-flow', (event, collection: string) => {
    Logger.Log().debug('ipcMain: get-started-flow');

    const db = new DbCollection();

    event.returnValue = db.queryRenameStartedFlows(collection);
  });
}

/**
 * Function to encapsulate ipc libraries
 */
function ipcLibraries() {
  // Save a library to the database
  ipcMain.on('save-library', (event, args: ILibrary) => {
    Logger.Log().debug('ipcMain: save-library');

    // Create database
    const db = new DbLibrary();

    // Insert data and close database
    db.insertRow(args);
    db.dbClose();

    Helper.createDirectory(args.library);
  });

  // Get all libraries
  ipcMain.on('get-libraries', (event, args: ILibrary) => {
    Logger.Log().debug('ipcMain: get-libraries');

    // Create database
    const db = new DbLibrary();

    event.returnValue = db.queryLibraries();
  });
}

/**
 * Function to encapsulate ipc pictures
 */
function ipcPictures() {
  // Get all pictures within the base flow directory
  ipcMain.on('get-baseFLow-pictures', (event, album: string) => {
    Logger.Log().debug('ipcMain: get-baseFLow-pictures');

    const db = new DbBaseFlow();

    event.returnValue = db.queryBaseFlow(album);
  });

  // Get all pictures within the backup flow directory
  ipcMain.on('get-backupFLow-pictures', (event, album: string) => {
    Logger.Log().debug('ipcMain: get-backupFLow-pictures');

    const db = new DbBackupFlow();

    event.returnValue = db.queryBackupFlow(album);
  });

  // Get all pictures within the preview flow directory
  ipcMain.on('get-previewFLow-pictures', (event, album: string) => {
    Logger.Log().debug('ipcMain: get-previewFLow-pictures');

    const db = new DbPreviewFlow();

    event.returnValue = db.queryAllWhereAlbum(album);
  });

  // Start pipeline
  ipcMain.on('save-pictures', (event, args, album: IAlbum) => {
    Logger.Log().debug('ipcMain: save-pictures');

    const dbSettings = new DbSettings();

    // Create database
    const albumDb = new DbAlbum();

    albumDb.insertRow(album);
    albumDb.dbClose();

    //Create album
    Helper.createDirectory(album.album);

    if (Helper.isDirectory(album.album)) {
      const collectionDb = new DbCollection();
      let flows: IFlow = collectionDb.queryAllFlows(album.collection);

      // Creating flow directories
      Object.values(flows).forEach(flow => {
        // The selection flow is a virtual directory, so it doesn't need to be created
        if(flow != flows.selection) {
          Helper.createDirectory(path.join(album.album, flow));
        }
      });

      collectionDb.dbClose();

      // pictures
      const picDb = new DbBaseFlow();
      const backupDb = new DbBackupFlow();
      const dbPreview = new DbPreviewFlow();
   
      // pipeline
      args.forEach((picture: IBase) => {
        const destBase: string = path.join(album.collection,`${album.name} ${album.date}`, flows.base, picture.hashed);
        const destBackup: string = path.join(album.collection,`${album.name} ${album.date}`, flows.backup, picture.hashed);
        const destPreview: string = path.join(album.collection,`${album.name} ${album.date}`, flows.preview, `${picture.hashed.split('.')[0]}.jpg`);
        
        let dataBaseFlow: IBase = { collection: album.collection, album: album.album, source: picture.source, name: picture.name, destination: destBase, selection: 0};
        let dataBackupFlow: IBase = { collection: album.collection, album: album.album, source: picture.source, name: picture.name, destination: destBackup};
        let dataPreviewFlow: IPreview = { collection: album.collection, album: album.album ,base: picture.source, name: picture.name, preview: destPreview}; 

        // copy base
        Helper.copyFile(picture.source, path.join(path.dirname(destBase), picture.hashed));

        // Insert data into database
        picDb.insertRow(dataBaseFlow);

        // copy backup
        Helper.copyFile(picture.source, path.join(path.dirname(destBackup), picture.hashed));

        // Insert data into database
        backupDb.insertRow(dataBackupFlow);
        
        // convert preview
        const convert = `magick convert \"${picture.source}\" -quality ${dbSettings.queryConversion()} -verbose \"${destPreview}\"`
        const data = cp.execSync(convert);

        dbPreview.insertRow(dataPreviewFlow);

        Logger.Log().debug(convert);
      });

      picDb.dbClose();
      backupDb.dbClose();
      dbPreview.dbClose();
    }

    event.returnValue = "";
  });

  // Get all preview pictures from a specified album
  ipcMain.on('get-preview-pictures', (event, args) => {
    Logger.Log().debug('get-preview-pictures');

    // Create database
    const db = new DbPreviewFlow();

    event.returnValue = db.queryAllWhereAlbum(args);
  });
}

/**
 * Function to encapsulate ipc albums
 */
function ipcAlbums() {
  // Check wether an album has started organizing
  ipcMain.on("get-album-started", (event, album: string) => {
    Logger.Log().debug('ipcMain: get-album-started');

    const db = new DbAlbum();

    event.returnValue = db.queryStarted(album);
  });

  // Update wether an album is updated
  ipcMain.on("update-album-started", (event, album: IAlbum) => {
    Logger.Log().debug('ipcMain: update-album-started');

    const db = new DbAlbum();
    
    db.updateStartedRecord(1, album.album);

    event.returnValue = "";
  });
  
  // Save an album to the database
  ipcMain.on('save-album', (event, args: IAlbum) => {
    Logger.Log().debug('ipcMain: save-album');

    // Create database
    const db = new DbLibrary();

    db.insertRow(args);
    db.dbClose();

    Helper.createDirectory(args.album);
  });
  
  // Get all albums
  ipcMain.on('get-albums', (event, args) => {
    Logger.Log().debug('ipcMain: get-albums');

    // Create database
    const db = new DbAlbum();

    event.returnValue = db.queryAlbums(args);
  });

  // Get all records from a specified album
  ipcMain.on('get-single-album', (event, collection: string) => {
    Logger.Log().debug('ipcMain: get-single-album');

    // Create database
    const db = new DbAlbum();

    event.returnValue = db.querySingleAlbum(collection);
  }); 
}

/**
 * Function to encapsulate ipc settings
 */
function ipcSettings() {
  // Save settings to the database
  ipcMain.on('save-settings', (event, args) => {
    Logger.Log().debug('ipcMain: save-settings');

    // Create database
    const db = new DbSettings();
    
    // If table exists update database
    db.isEmpty() ? db.insertRow(args) : db.updateRow(args);
    // if(db.isEmpty()) {
    //   db.insertRow(args);
    // }
    // else {
    //   db.updateRow(args);
    // }
    
    db.dbClose();
  });

  // Get settings from the database
  ipcMain.on('get-settings', (event) => {
    Logger.Log().debug('ipcMain: get-settings');

    const db = new DbSettings();

    event.returnValue = db.queryAll();
  });

  // Check wether the settings table has an empty row
  ipcMain.on('check-settings-empty', (event) => {
    Logger.Log().debug('ipcMain: check-settings-empty');

    const db = new DbSettings();

    event.returnValue = db.isEmpty();
  });
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
