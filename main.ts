import { app, BrowserWindow, screen, ipcMain, remote } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';

//import * as sqlite from 'sqlite3';
import * as sqlite from 'better-sqlite3';
import { Logger } from './logger';
import { Settings } from './shared/database/settings';
import { Library } from './shared/database/library';
import { ILibrary, ISettings, ICollection, IAlbum, IFlow, IBase } from './shared/database/interfaces';
import { fstat } from 'fs';
import { Collection } from './shared/database/collection';
import { Album } from './shared/database/album';
import { cpuUsage, electron } from 'process';
import { BaseFlow } from './shared/database/baseFlow';
import { autoUpdater } from 'electron-updater';
import { Updater } from './shared/updater/updater';

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
      slashes: true
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
  // autoUpdater.on('checking-for-update', () => {
  //   console.log("Checking for updates");
  //   Logger.Log().debug("Checking for updates");
  // });

  // autoUpdater.on('update-available', (info) => {
  //   console.log("Update available");
  //   Logger.Log().debug("Update available");
  // });

  // autoUpdater.on('update-not-available', (info) => {
  //   console.log("Update not available");
  //   Logger.Log().debug("Update not available");
  // });

  // autoUpdater.on('error', (error) => {
  //   console.log("error");
  //   Logger.Log().debug("error");
  // });

  // autoUpdater.on('download-progress', (progress) => {
  //   console.log(`Download speed: ${progress.bytesPerSecond} - Download ${progress.percent}`);
  //   Logger.Log().debug(`Download speed: ${progress.bytesPerSecond} - Download ${progress.percent}`);
  // });

  // autoUpdater.on('update-downloaded', (info) => {
  //   console.log("Update will be installed");
  //   Logger.Log().debug("Update will be installed");
  //   autoUpdater.quitAndInstall();
  // });


  ipcMain.on('save-settings', (event, args) => {
    Logger.Log().debug('SAVE SETTINGS');
    // Create database
    const db = new Settings();
    const dbCon = db.dbConnection();

    // If table exists update database
    if(db.tableExists(dbCon)) {
      db.updateRow(dbCon, args);
    }
    // Else create a new table
    else {
      db.createTable(dbCon);
      db.insertRow(dbCon, args);
    }
    
    //const row: ISettings = db.queryAll(dbCon);
    db.dbClose(dbCon);
  });

  ipcMain.on('get-settings', (event) => {
    Logger.Log().debug("get-settings");

    const db = new Settings();
    const dbCon = db.dbConnection();

    const row: ISettings = db.queryAll(dbCon);
    event.returnValue = row;
  });
  

  ipcMain.on('check-tableExists', (event) => {
    Logger.Log().debug('');
    const db = new Settings();
    const dbCon = db.dbConnection();

    event.returnValue = db.tableExists(dbCon);
  });

  ipcMain.on('save-library', (event, args: ILibrary) => {
    Logger.Log().debug('SAVE library');

    // Create database
    const db = new Library();
    const dbcon = db.dbConnection();

    db.createTable(dbcon);
    db.insertRow(dbcon, args);
    db.dbClose(dbcon);

    if (!fs.existsSync(args.path)){
      fs.mkdirSync(args.path);
    }
  });

  ipcMain.on('save-collection', (event, args: ICollection) => {
    Logger.Log().debug('SAVE collection');

    // Create database
    const db = new Collection();
    const dbcon = db.dbConnection();

    if(!db.tableExists(dbcon)) {
      db.createTable(dbcon);
    }

    db.insertRow(dbcon, args);
    db.dbClose(dbcon);

    if (!fs.existsSync(args.path)){
      fs.mkdir(args.path, err => {
        console.log(err);
      });
    }
  });
 
  ipcMain.on('save-album', (event, args: IAlbum) => {
    Logger.Log().debug('SAVE album');

    // Create database
    const db = new Library();
    const dbcon = db.dbConnection();

    db.createTable(dbcon);
    db.insertRow(dbcon, args);
    db.dbClose(dbcon);

    if (!fs.existsSync(args.path)){
      fs.mkdirSync(args.path);
    }
  });

  ipcMain.on('save-pictures', (event, args, y: IAlbum) => {
    Logger.Log().debug('save-pictures');
    // Create database
    const db = new Album();
    const dbcon = db.dbConnection();

    if(!db.tableExists(dbcon)) {
      db.createTable(dbcon);
    }

    db.insertRow(dbcon, y);
    db.dbClose(dbcon);

    if (!fs.existsSync(y.path)){
      fs.mkdir(y.path, err => {
        console.log(err);
      });

      const dbb = new Collection();
      const dbbcon = dbb.dbConnection();
      let flows: IFlow = dbb.queryFlows(dbbcon, y.collection);

      Object.values(flows).forEach(flow => {
        if(flow != flows.selection) {

          console.log(`FLOW: ${flow} - path: ${path.join(y.path, flow)}`);

          fs.mkdir(path.join(y.path, flow), err => {
            console.log(err);
          });
        }

      });
      db.dbClose(dbbcon);

      // pictures
      const picDb = new BaseFlow();
      const conPic = picDb.dbConnection();

      if(!picDb.tableExists(conPic)) {
        picDb.createTable(conPic);
      }
      
      args.forEach((picture: IBase) => {
        const dest: string = path.join(y.collection,`${y.name} ${y.date}`, flows.base, picture.name);
        console.log(`src: ${picture.source},dest: ${dest}`);

        let x: IBase = { source: picture.source, name: picture.name, destination: dest, selection: 0};
        picDb.insertRow(conPic, x);
        fs.copyFile(picture.source, dest, (err) => {
          if (err) throw err;
          console.log(`Picture: ${x.destination}`);
        });
      });

      picDb.dbClose(conPic);
    }
  });

  ipcMain.on('get-libraries', (event, args: ILibrary) => {
    Logger.Log().debug('get-libraries');

        // Create database
    const db = new Library();
    const dbCon = db.dbConnection();

    const exists = db.tableExists(dbCon);

    if(exists) {
      console.log(db.queryLibraries(dbCon));
      event.returnValue = db.queryLibraries(dbCon);
    }
    //event.returnValue = db.tableExists(dbCon);
  });

  ipcMain.on('get-collections', (event, args: ILibrary) => {
    Logger.Log().debug('get-collections');

        // Create database
    const db = new Collection();
    const dbCon = db.dbConnection();

    const exists = db.tableExists(dbCon);

    if(exists) {
      console.log(db.queryCollections(dbCon));
      event.returnValue = db.queryCollections(dbCon);
    }
    //event.returnValue = db.tableExists(dbCon);
  }); 

} catch (e) {
  // Catch Error
  // throw e;
  //logger.Log().debug(e);

}
