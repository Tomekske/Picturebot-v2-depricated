import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import * as hasha from 'hasha';
import * as cp from 'child_process';

import { Logger } from '../../shared/logger/logger';
import { IAlbum, IBase, IFlow } from '../database/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { app, remote } from 'electron';
import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/template';

/**
 * Static helper class containing helper methods
 */
export class Helper {
    /**
     * Build path to the user's documents
     */
    static pathMyDocuments(): string {
        return path.join(os.homedir(), "Documents");
    }

    /**
     * Create a new directory
     * @param directory New directory path
     */
    static createDirectory(directory: string) {
        // Create a new directory if the path doesn't exists
        if (!fs.existsSync(directory)) {
            fs.mkdir(directory, err => {
                Logger.Log().error(err);
            });

            Logger.Log().debug(`Created directory: '${directory}'`);
        }
    }

    /**
     * Method to check wether a directory exists
     * @param directory Path to the directory
     */
    static isDirectory(directory: string): boolean {
        return fs.existsSync(directory) ? true : false;
    }

    /**
     * Copy a file to another location
     * @param source Source location
     * @param destination Destination location
     */
    static copyFile(source: string, destination: string) {
        try {
            fs.copyFileSync(source, destination);
            Logger.Log().debug(`Copy Picture: '${source}' -> '${destination}'`);
        } catch (error) {
            Logger.Log().error(error);
        }
    }

    /**
     * Sort dateTimes array (from oldest -> youngest)
     * @param a DateTime a
     * @param b DateTime b
     */
    static sortDateTimes(a, b) {
        return a.modification - b.modification;
    }

    /**
     * Convert an ISO picture's date to dd-mm-YYYY
     * @param iso a picture's ISO string
     */
    static formatDate(iso: string): string {
        const date = new Date(iso);

        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    }

    /**
     * Convert an ISO picture's time to HH:MM:ss
     * @param iso a picture's ISO string
     */
    static formatTime(iso: string): string {
        const date = new Date(iso);

        return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    /**
     * Rename a picture's name to a hashed version. This procedure makes sure every picture gets a unique name, this prevents colliding filenames
     * Example: random.jpg -> pb_00001_{hash}.jpg
     * @param picture Picture object
     * @param index Index of the chronologically ordered picture
     * @param padding Set the index length, example: padding = 3 -> index = 001
     */
    static renameHashedPicture(picture: IBase, index: number, padding: number): string {
        // Get the first 10 characters from the hashed string
        const hash = hasha.fromFileSync(picture.source).substring(0, 10);

        return `pb_${(index).toString().padStart(padding, '0')}_${hash}${path.extname(picture.name)}`;
    }

    /**
     * Rename a picture's name to a organized version
     * Example: Shoot 24-10-2020/pb_00001_{hash}.jpg -> Shoot_24-10-2020_00001.jpg
     * @param picture Picture object
     * @param index Index of the chronologically ordered picture
     * @param padding Set the index length, example: padding = 3 -> index = 001
     * @param isPreview Specify wether the preview flow should get renamed, is false by default
     */
    static renameOrganizesPicture(picture: any, index: number, padding: number, isPreview: boolean = false): string {
        let dirname = path.basename(picture.album);
        // Get the correct extension format of the original picture
        let extname = isPreview ? path.extname(picture.preview) : path.extname(picture.base);

        return `${dirname.split(" ")[0]}_${dirname.split(" ")[1]}_${(index).toString().padStart(padding, '0')}${extname}`;
    }

    /**
     * Opens a directory in the explorer
     * @param path Path to open in the explorer
     * @param snack Snackbar reference
     */
    static openInExplorer(path: string, snack: MatSnackBar) {
        let message: string;

        // Only open the path in the explorer if the path exists
        if (fs.existsSync(path)) {
            message = `Opened '${path}' in explorer`;

            cp.exec(`start "" "${path}"`);
            Logger.Log().debug(`Explorer: ${message}`);
        } else {
            message = `Unable to open '${path}' in explorer`;

            Logger.Log().error(`Explorer: ${message}`);
        }

        // Display message to the user
        snack.open(message, "Dismiss", {
            duration: 4000,
            horizontalPosition: "end"
        });
    }

    /**
     * Opens a specified file
     * @param path Path to open the file
     */
    static openFile(path: string, snack: MatSnackBar) {
        let message: string;

        // Only open the path in the explorer if the path exists
        if (fs.existsSync(path)) {
            message = `File '${path}' opened`;

            cp.exec(`"${path}"`);
            Logger.Log().debug(`File: ${message}`);
        } else {
            message = `Unable to open file '${path}'`;

            Logger.Log().error(`File: ${message}`);
        }

        // Display message to the user
        snack.open(message, "Dismiss", {
            duration: 4000,
            horizontalPosition: "end"
        });
    }

    /**
     * Delete a picture from the filesystem
     * @param path Path to the picture
     */
    static deletePicture(path: string) {
        if (fs.existsSync(path)) {
            try {
                fs.unlinkSync(path);
                Logger.Log().debug(`Delete picture: picture '${path}' deleted`);
            } catch (error) {
                Logger.Log().error(`Delete picture: '${path}' - ${error}`);
            }
        } else {
            Logger.Log().error(`Delete picture: picture '${path}' doesn't exists`);
        }
    }

    /**
     * Rename a directory
     * @param source Source location of the folder
     * @param destination Destination location of the folder
     */
    static renameDirectory(source: string, destination: string) {
        if (fs.existsSync(source)) {
            fs.renameSync(source, destination);
            Logger.Log().debug(`Rename directory: directory '${source}' -> '${destination}' renamed`);

        } else {
            Logger.Log().error(`Rename directory: directory '${source}' already exists`);
        }
    }

    /**
     * Check if the executable is a release version
     * @param isMain Specify wether the function is called from the main process or render process
     */
    static isProduction(isMain: boolean): boolean {
        let version: string = isMain ? app.getVersion() : remote.app.getVersion();

        return version.includes("dev") ? false : true;
    }

    /**
     * 
     * @param program Program executable
     * @param options Path to open the file
     * @param snack Snackbar reference
     */
    static ExternalProgram(program: string, options: string, snack: MatSnackBar) {
        let message: string;

        if (program) {
            if (fs.existsSync(options)) {
                // Get executable name without the extension
                message = `Editing in ${path.parse(program).name}`;

                cp.exec(`"${program}" "${options}"`);
                Logger.Log().debug(`File: ${message}`);
            } else {
                message = `Unable to open file '${options}'`;

                Logger.Log().error(`File: ${message}`);
            }
        } else {
            message = "No editing software is configured"
        }

        // Display message to the user
        snack.open(message, "Dismiss", {
            duration: 4000,
            horizontalPosition: "end"
        });
    }

    /**
     * Get the filename of a specified file without the extension
     * @param file Filename
     */
    static BasenameWithoutExtension(file: string): string {
        return path.basename(file).split('.')[0]
    }

    /**
     * Parse a filename using an album name and date
     * Example: Rio De Janeiro 24-05-2020 -> Rio_De_Janeiro_24-05-20
     * Example: Arizona 24-05-2020 -> Arizona_24-05-20
     * @param name Album name containing whitespaces 
     * @param date Album date
     */
    static ParsePictureNameWithDate(name: string, date: string): string {
        return `${name.split(" ").join("_")}_${date}`;
    }

    /**
     * Parse a filename using an album name
     * Example: Rio De Janeiro -> Rio_De_Janeiro
     * Example: Arizona -> Arizona   
     * @param name Album name containing whitespaces 
     */
    static ParsePictureNameWithoutDate(name: string): string {
        return name.split(" ").join("_");
    }

    /**
     * Copy a file to another location
     * @param source Source location
     * @param destination Destination location
     */
    static renameFile(source: string, destination: string) {
        try {
            fs.renameSync(source, destination);
            Logger.Log().debug(`Copy Picture: '${source}' -> '${destination}'`);
        } catch (error) {
            Logger.Log().error(error);
        }
    }

    /**
     * Enable full-screen mode
     * @param document Document object
     */
    static windowFullScreen(document: any): void {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }  
    }

    /**
     * Close full-screen mode
     * @param document Document object
     */
    static windowCloseFullScreen(document: any): void {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(err => Promise.resolve(err));
        }        
    }
}
