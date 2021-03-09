import { autoUpdater } from 'electron-updater';
import { Logger } from '../logger/logger';

/**
 * Class to automatically update the application
 */
export class Updater { 
    event: any;

    /**
     * Updater constructor
     * @param event Event object
     */
    constructor(event) {
        this.event = event;

        autoUpdater.checkForUpdates();
    }

    /**
     * Method to check for new updates
     */
    checkForUpdates() {
        autoUpdater.on('checking-for-update', (info) => {
            Logger.Log().debug(`Checking for updates: ${info}`);
        });    
    }

    /**
     * Method to check whether an update is available
     */
    isUpdateAvailable() {
        autoUpdater.on('update-available', (info) => {
            Logger.Log().debug(`Update available: ${info}`);
            this.event.returnValue = true;
        });
    }

    /**
     * Method to check whether an update is not available
     */
    isUpdateNotAvailable() {
        autoUpdater.on('update-not-available', (info) => {
            Logger.Log().debug(`Update not available: ${info}`);
            this.event.returnValue = false;
        });        
    }

    /**
     * Method to check whether an error occurred
     */
    error() {
        autoUpdater.on('error', (error) => {
            Logger.Log().debug(`error: ${error}`);
        });
    }

    /**
     * Method to check the download progress of the update
     */
    downloadProgress() {
        autoUpdater.on('download-progress', (progress) => {
            Logger.Log().debug(`Update download speed: ${progress.bytesPerSecond} - Download ${progress.percent}`);
        });
    }

    /**
     * Method to install the update
     */
    updateDownloaded() {
        autoUpdater.on('update-downloaded', (info) => {
            Logger.Log().debug(`Update is being installed: ${info}`);
            autoUpdater.quitAndInstall();
        });
    }
}
