import { autoUpdater } from 'electron-updater';
import { truncateSync } from 'fs';
import { Logger } from '../../logger';

export class Updater { 
    constructor() {
        autoUpdater.checkForUpdates();
    }

    checkForUpdates() {
        autoUpdater.on('checking-for-update', (info) => {
            Logger.Log().debug(`Checking for updates: ${info}`);
        });    
    }

    isUpdateAvailable() /*: boolean */{
        autoUpdater.on('update-available', (info) => {
            Logger.Log().debug(`Update available: ${info.releaseNotes}`);
        });    
        //return true;
    }

    isUpdateNotAvailable()/*: boolean*/{
        autoUpdater.on('update-not-available', (info) => {
            Logger.Log().debug(`Update not available: ${info}`);
        });        
        //return true;
    }

    error() {
        autoUpdater.on('error', (error) => {
            Logger.Log().debug(`error: ${error}`);
        });
    }

    downloadProgress() {
        autoUpdater.on('download-progress', (progress) => {
            Logger.Log().debug(`Download speed: ${progress.bytesPerSecond} - Download ${progress.percent}`);
        });
    }

    updateDownloaded() {
        autoUpdater.on('update-downloaded', (info) => {
            Logger.Log().debug(`Update will be installed: ${info}`);
            autoUpdater.quitAndInstall();
        });
    }


}
