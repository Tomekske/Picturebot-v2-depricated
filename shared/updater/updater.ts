import { autoUpdater } from 'electron-updater';
import { Logger } from '../logger/logger';

/**
 * Class to automatically update the application
 */
export class Updater { 

    /**
     * Updater constructor
     */
    constructor() {
        console.log("CONSTRUCTOR UPDATER");
        autoUpdater.checkForUpdates();
    }

    /**
     * Method to check for new updates
     */
    checkForUpdates() {
        autoUpdater.on('checking-for-update', (info) => {
            console.log("checkForUpdates");
            Logger.Log().debug(`Checking for updates: ${info}`);
        });    
    }

    /**
     * Method to check whether an update is available
     */
    isUpdateAvailable() {
        autoUpdater.on('update-available', (info) => {
            console.log("isUpdateAvailable");
            Logger.Log().debug(`Update available: ${info.releaseNotes}`);
        });    
    }

    /**
     * Method to check whether an update is not available
     */
    isUpdateNotAvailable() {
        autoUpdater.on('update-not-available', (info) => {
            console.log("isUpdateNotAvailable");
            Logger.Log().debug(`Update not available: ${info}`);
        });        
    }

    /**
     * Method to check whether an error occurred
     */
    error() {
        autoUpdater.on('error', (error) => {
            console.log(error);
            Logger.Log().debug(`error: ${error}`);
        });
    }

    /**
     * Method to check the download progress of the update
     */
    downloadProgress() {
        autoUpdater.on('download-progress', (progress) => {
            console.log("downloadProgress");
            Logger.Log().debug(`Update download speed: ${progress.bytesPerSecond} - Download ${progress.percent}`);
        });
    }

    /**
     * Method to install the update
     */
    updateDownloaded() {
        autoUpdater.on('update-downloaded', (info) => {
            console.log("updateDownloaded");
            Logger.Log().debug(`Update is being installed: ${info}`);
            autoUpdater.quitAndInstall();
        });
    }
}
