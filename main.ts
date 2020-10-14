import { app, BrowserWindow, screen, ipcMain, remote } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';
import * as cp from 'child_process';
import * as sqlite from 'better-sqlite3';

import { Logger } from './logger';
import { DbSettings } from './shared/database/dbSettings';
import { DbLibrary } from './shared/database/dbLibrary';
import { ILibrary, ISettings, ICollection, IAlbum, IFlow, IBase } from './shared/database/interfaces';
import { fstat } from 'fs';
import { DbCollection } from './shared/database/dbCollection';
import { DbAlbum } from './shared/database/dbAlbum';
import { cpuUsage, electron } from 'process';
import { DbBaseFlow } from './shared/database/dbBaseFlow';
import { autoUpdater } from 'electron-updater';
import { Updater } from './shared/updater/updater';
import { DbBackupFlow } from './shared/database/dbBackupFlow';
import { DbPreviewFlow } from './shared/database/dbPreviewFlow';

let win: BrowserWindow = null;
let sendStatus = null;
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
  Logger.Log().debug('TRYYYYYYYY'); 

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


  //autoUpdater.checkForUpdates();
  const updater = new Updater();

  updater.checkForUpdates();
  updater.isUpdateAvailable();
  updater.isUpdateNotAvailable();
  updater.error();
  updater.downloadProgress();
  updater.updateDownloaded();
  Logger.Log().debug("HET WERKTTTTTTTTTTTTT");

  ipcMain.on('save-settings', (event, args) => {
    Logger.Log().debug('Saving settings');
    // Create database
    const db = new DbSettings();

    // If table exists update database
    if(db.isEmpty()) {
      Logger.Log().debug('Saving settings: table exists');
      db.insertRow(args);
    }
    // Else create a new table
    else {
      Logger.Log().debug('Saving settings: new table');
      db.updateRow(args);
    }
    
    //const row: ISettings = db.queryAll(dbCon);
    db.dbClose();
  });

  ipcMain.on('get-settings', (event) => {
    Logger.Log().debug("get-settings");

    const db = new DbSettings();

    const row: ISettings = db.queryAll();
    event.returnValue = row;
  });

  ipcMain.on('get-flows', (event, collection: string) => {
    Logger.Log().debug("get-flows");

    const db = new DbCollection();

    event.returnValue = db.queryFlows(collection);
  });

  ipcMain.on('check-settings-empty', (event) => {
    Logger.Log().debug('');
    const db = new DbSettings();

    event.returnValue = db.isEmpty();
  });

  ipcMain.on('save-library', (event, args: ILibrary) => {
    Logger.Log().debug('SAVE library');

    // Create database
    const db = new DbLibrary();

    db.insertRow(args);
    db.dbClose();

    if (!fs.existsSync(args.library)){
      fs.mkdirSync(args.library);
    }
  });

  ipcMain.on('save-collection', (event, args: ICollection) => {
    Logger.Log().debug('SAVE collection');

    // Create database
    const db = new DbCollection();

    db.insertRow(args);
    db.dbClose();

    if (!fs.existsSync(args.collection)){
      fs.mkdir(args.collection, err => {
        console.log(err);
      });
    }
  });
 
  ipcMain.on('save-album', (event, args: IAlbum) => {
    Logger.Log().debug('SAVE album');

    // Create database
    const db = new DbLibrary();

    db.insertRow(args);
    db.dbClose();

    if (!fs.existsSync(args.album)){
      fs.mkdirSync(args.album);
    }
  });

  ipcMain.on('save-pictures', (event, args, y: IAlbum) => {
    Logger.Log().debug('save-pictures');

    const dbSettings = new DbSettings();

    // Create database
    const albumDb = new DbAlbum();

    albumDb.insertRow(y);
    albumDb.dbClose();

    // Create album
    if (!fs.existsSync(y.album)) {
      fs.mkdir(y.album, err => {
        console.log(err);
      });
    

      const collectionDb = new DbCollection();
      let flows: IFlow = collectionDb.queryFlows(y.collection);

      // Creating flow directories
      Object.values(flows).forEach(flow => {
        if(flow != flows.selection) {
          console.log(`FLOW: ${flow} - path: ${path.join(y.album, flow)}`);
          //console.log(`FLOW: ${flow}`);

          fs.mkdir(path.join(y.album, flow), err => {
            console.log(err);
          });
        }
      });
      collectionDb.dbClose();

      // // pictures
      const picDb = new DbBaseFlow();
      const backupDb = new DbBackupFlow();
      const dbPreview = new DbPreviewFlow();
   
      // // pipeline
      args.forEach((picture: IBase) => {
        const destBase: string = path.join(y.collection,`${y.name} ${y.date}`, flows.base, picture.hashed);
        const destBackup: string = path.join(y.collection,`${y.name} ${y.date}`, flows.backup, picture.hashed);
        const destPreview: string = path.join(y.collection,`${y.name} ${y.date}`, flows.preview, `${picture.hashed.split('.')[0]}.jpg`);
        
        let dataBaseFlow: IBase = { collection: y.collection, album: y.album, source: picture.source, name: picture.name, destination: destBase, selection: 0};
        let dataBackupFlow: IBase = { collection: y.collection, album: y.album, source: picture.source, name: picture.name, destination: destBackup};
        let dataPreviewFlow: IBase = { collection: y.collection, album: y.album ,source: picture.source, destination: destPreview}; 

        console.log(`Base: ${destBase} - ${dataBaseFlow.name}`);
        console.log(`Backup: ${destBackup} - ${dataBackupFlow}`);
        console.log(`Preview: ${destPreview} - ${dataPreviewFlow}`);
        Logger.Log().debug(`Preview: ${destPreview} - ${dataPreviewFlow}`);

        // copy base
        fs.copyFile(picture.source, path.join(path.dirname(destBase), picture.hashed), (err) => {
          if (err) throw err;
          console.log(`Picture: ${dataBaseFlow.destination}`);
        });
        // Inserting data into database
        picDb.insertRow(dataBaseFlow);

        // copy backup
        fs.copyFile(picture.source, path.join(path.dirname(destBackup), picture.hashed), (err) => {
          if (err) throw err;
          console.log(`Picture: ${dataBackupFlow.destination}`);
        });
        backupDb.insertRow(dataBackupFlow);
        

        // convert preview
        const strr = `magick convert \"${picture.source}\" -quality ${dbSettings.queryConversion()} -verbose \"${destPreview}\"`
        const data = cp.execSync(strr);
        dbPreview.insertRow(dataPreviewFlow);  
      });

      picDb.dbClose();
      backupDb.dbClose();
      dbPreview.dbClose();
    }

    event.returnValue = "";
  });
  

  ipcMain.on('get-libraries', (event, args: ILibrary) => {
    Logger.Log().debug('get-libraries');

        // Create database
    const db = new DbLibrary();

    const exists = db.tableExists();

    if(exists) {
      console.log(db.queryLibraries());
      event.returnValue = db.queryLibraries();
    }
    //event.returnValue = db.tableExists(dbCon);
  });

  ipcMain.on('get-collections', (event, args: ILibrary) => {
    Logger.Log().debug('get-collections');

        // Create database
    const db = new DbCollection();

    const exists = db.tableExists();

    if(exists) {
      console.log(db.queryCollections());
      event.returnValue = db.queryCollections();
    }
    //event.returnValue = db.tableExists(dbCon);
  });

  ipcMain.on('get-albums', (event, args) => {
    Logger.Log().debug('get-albums');

    // Create database
    const db = new DbAlbum();

    event.returnValue = db.queryAlbums(args);
  }); 

  ipcMain.on('get-preview-pictures', (event, args) => {
    Logger.Log().debug('get-preview-pictures');

    // Create database
    const db = new DbPreviewFlow();

    event.returnValue = db.queryAllWhere(args);
  });
} catch (e) {
  // Catch Error
  // throw e;
  //logger.Log().debug(e);

}
