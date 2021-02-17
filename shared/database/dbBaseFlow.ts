import { Logger } from '../logger/logger';
import { Sqlite } from './sqlite';
import * as path from 'path';
import { IAlbum, IBase, IFlow } from './interfaces';
import { Api } from './api';
import { Helper } from '../helper/helper';

export class DbBaseFlow extends Sqlite {

    /**
     * DbBaseFlow constructor
     */
    constructor() {
        super();
    }

    /**
     * Method to create the baseFlow table
     */
    createTable() {
        let query: string = `CREATE TABLE IF NOT EXISTS baseFlow(
            "collection" varchar(400) NOT NULL,
            "album" varchar(200) NOT NULL,
            "favorited" INTEGER NULL,
            "backup" varchar(400) NOT NULL,
            "preview" varchar(400),
            "base" varchar(400) NOT NULL PRIMARY KEY,
            "date" varchar(10) NOT NULL,
            "time" varchar(8) NOT NULL)`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            this.connection.exec(query);
        } catch (err) {
            Logger.Log().error(`DbBaseFlow createTable query error: ${err}`);
        }
    }

    /**
     * Method to check whether the baseFlow table exists
     */
    tableExists() {
        let query: string = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='baseFlow'";
        let count = 0;

        try {
            Logger.Log().debug(`Query: ${query}`);
            count = this.connection.prepare(query).pluck().get();
        } catch (err) {
            Logger.Log().error(`DbBaseFlow tableExists query error: ${err}`);
        }

        return ((count == 1) ? true : false);
    }

    /**
     * Method to insert data into table's row
     * @param args Data needed to insert into the table's row
     */
    insertRow(args) {
        const stmt = this.connection.prepare("INSERT INTO baseFlow VALUES (@collection, @album, @favorited, @backup, @preview, @base, @date, @time);");

        try {
            Logger.Log().debug(`Query: INSERT INTO baseFlow VALUES ("${JSON.stringify(args)}")`);
            this.connection.prepare("INSERT INTO baseFlow VALUES (@collection, @album, @favorited, @backup, @preview, @base, @date, @time);").run(args);
        } catch (err) {
            Logger.Log().error(`DbBaseFlow insertRow query error: ${err}`);
        }
    }

    /**
     * Method to update the destination location
     * @param picture Updated base flow picture object
     */
    updateBase(picture: IBase) {
        let query: string = `UPDATE baseFlow SET base='${picture.baseUpdated}' WHERE album='${picture.album}' AND preview='${picture.preview}';`;
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbBaseFlow updateBase query error: ${err}`);
        }

        return result;
    }

    /**
     * Method to update the destination location
     * @param picture Updated preview flow picture object
     */
    updatePreview(picture: IBase) {
        let query: string = `UPDATE baseFlow SET preview='${picture.previewUpdated}' WHERE album='${picture.album}' AND base='${picture.base}';`;
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbBaseFlow updatePreview query error: ${err}`);
        }

        return result;
    }

    /**
     * Method to query all values from the baseFlow table
     */
    queryAll() {
        let query: string = 'SELECT DISTINCT * FROM baseFlow;';
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).get();
        } catch (err) {
            Logger.Log().error(`DbBaseFlow queryAll query error: ${err}`);
        }

        return result;
    }

    /**
     * Method to query all records from the baseFlow table
     * @param album Select the album where all the records will get queried
     */
    queryBaseFlow(album: string) {
        let query: string = `SELECT * FROM baseFlow where album='${album}' ORDER BY preview ASC;`;
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).all();
        } catch (err) {
            Logger.Log().error(`DbBaseFlow queryBaseFlow query error: ${err}`);
        }

        return result;
    }

    /**
     * Delete a picture relation from the database
     * @param path Path to the picture
     */
    deletePicture(path: string) {
        let query: string = `Delete FROM baseFlow WHERE base='${path}'`;
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbBaseFlow deletePicture query error: ${err}`);
        }

        return result;
    }

    /**
     * Delete pictures relations located in a specified album from the database
     * @param album Album where the pictures are located in
     */
    deletePicturesWhereAlbum(album: string) {
        let query: string = `Delete FROM baseFlow WHERE album='${album}'`;
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbBaseFlow deletePicturesWhereAlbum query error: ${err}`);
        }

        return result;
    }

    /**
     * Update album's name within the album, base and backup record
     * @param current Current album name
     * @param album Updated album name
     */
    updateAlbum(current: IAlbum, album: IAlbum) {
        let result = null;
        let flows: IFlow = Api.getFlows(current);
        let query: string = `UPDATE baseFlow SET 
            album=REPLACE(album,'${current.album}', '${album.album}'), 
            backup=REPLACE(backup, '${current.album}', '${album.album}'),      
            preview=REPLACE(preview, '${path.join(current.album, flows.preview, Helper.ParsePictureNameWithoutDate(path.basename(current.album)))}', '${path.join(album.album, flows.preview, Helper.ParsePictureNameWithoutDate(path.basename(album.album)))}'), 
            base=REPLACE(base, '${path.join(current.album, flows.base, Helper.ParsePictureNameWithoutDate(path.basename(current.album)))}','${path.join(album.album, flows.base, Helper.ParsePictureNameWithoutDate(path.basename(album.album)))}')`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbBaseFlow updateAlbum query error: ${err}`);
        }

        return result;
    }

    /**
     * Get the is favorited boolean of a specified picture
     * @param preview Selected preview
     */
    getIsFavoriteWherePreview(preview: string) {
        let query: string = `SELECT favorited FROM baseFlow WHERE preview='${preview}';`;
        let count = 0;

        try {
            Logger.Log().debug(`Query: ${query}`);
            count = this.connection.prepare(query).pluck().get();
        } catch (err) {
            Logger.Log().error(`DbBaseFlow getIsFavoriteWherePreview query error: ${err}`);
        }

        return ((count == 1) ? true : false);
    }

    /**
     * Update the favorited boolean of a specified picture
     * @param preview Selected preview
     * @param isFavorited Specified value
     */
    updateFavorited(preview: string, isFavorited: number) {
        let query: string = `UPDATE baseFlow SET favorited='${isFavorited}' WHERE preview='${preview}';`;
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbBaseFlow updateFavorited query error: ${err}`);
        }

        return result;
    }
}
