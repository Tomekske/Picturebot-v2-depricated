import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import * as hasha from 'hasha';
import * as cp from 'child_process';

import { Logger } from '../../shared/logger/logger';
import { IBase, IPreview } from '../database/interfaces';

/**
 * Static helper class containing helper methods
 */
export class Helper {
    /** Application name */
    static app: string = "Picturebot";

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
        if (!fs.existsSync(directory)){
            fs.mkdir(directory, err => {
                console.log(err);
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
        fs.copyFile(source, destination, (err) => {
            if (err) throw err;
            
            Logger.Log().debug(`Copy Picture: '${source}' -> '${destination}'`);
        });
    }

    /**
     * Sort dateTimes array
     * @param a DateTime a
     * @param b DateTime b
     */
    static sortDateTimes(a, b) {
        return a.modification - b.modification;
    }

    /**
     * Convert an ISO picture's date to dd-mm-YYYY
     * @param iso a picture's ISO date
     */
    static formatDate(iso: string): string {
        const date = new Date(iso);

        return date.toLocaleDateString('en-GB', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');
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
        let extname = isPreview ? path.extname(picture.preview) : path.extname(picture.destination);

        return `${dirname.split(" ")[0]}_${dirname.split(" ")[1]}_${(index).toString().padStart(padding, '0')}${extname}`;
    }

    /**
     * Opens a directory in the explorer
     * @param path Path to open in the explorer
     */
    static openInExplorer(path: string) {
        // Only open the path in the explorer if the path exists
        if(fs.existsSync(path)) {
            cp.exec(`start "" "${path}"`);
            Logger.Log().debug(`Explorer: opened '${path}' in explorer`);
        } else {
            Logger.Log().error(`Explorer: unable to open '${path}' in explorer`);
        }
    }
}
