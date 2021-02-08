import { Logger } from '../logger/logger';
import { Api } from './api';
import { IAlbum, IFlow } from './interfaces';
import { Sqlite } from './sqlite';
import * as path from 'path';
import { Helper } from '../helper/helper';

export class DbPreviewFlow extends Sqlite {

    /**
     * DbPreviewFlow constructor
     */
    constructor() {
        super();
    }

    /**
     * Method to create the previewFlow table
     */
    createTable() {
        let query: string = `CREATE TABLE IF NOT EXISTS previewFlow(
            "collection" varchar(400) NOT NULL,
            "name" varchar(200) NOT NULL,
            "album" varchar(200) NOT NULL,
            "base" varchar(400) NOT NULL,
            "preview" varchar(400) NOT NULL PRIMARY KEY,
            "date" varchar(10) NOT NULL,
            "time" varchar(8) NOT NULL)`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            this.connection.exec(query);
        } catch (err) {
            Logger.Log().error(`DbPreviewFlow createTable query error: ${err}`);
        }
    }

    /**
     * Method to check whether the previewFlow table exists
     */
    tableExists() {
        let query: string = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='previewFlow'";
        let count = 0;

        try {
            Logger.Log().debug(`Query: ${query}`);
            count = this.connection.prepare(query).pluck().get();
        } catch (err) {
            Logger.Log().error(`DbPreviewFlow tableExists query error: ${err}`);
        }

        return ((count == 1) ? true : false);
    }

    /**
     * Method to insert data into table's row
     * @param args Data needed to insert into the table's row
     */
    insertRow(args) {
        try {
            Logger.Log().debug(`Query: INSERT INTO PreviewFlow VALUES ("${JSON.stringify(args)}")`);
            this.connection.prepare("INSERT INTO PreviewFlow VALUES (@collection, @name, @album, @base, @preview, @date, @time);").run(args);
        } catch (err) {
            Logger.Log().error(`DbPreviewFlow insertRow query error: ${err}`);
        }
    }

    /**
     * Method to update the name record
     * @param update Updated values
     */
    updateName(update) {
        let query: string = `UPDATE previewFlow SET name='${update.name}' WHERE preview='${update.preview}' AND album='${update.album}';`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbPreviewFlow updateName query error: ${err}`);
        }
    }

    /**
     * Method to update the destination record
     * @param update Updated values
     */
    updatePreview(update) {
        let query: string = `UPDATE previewFlow SET preview='${update.updatedPreview}' WHERE name='${update.name}' AND album='${update.album}';`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbPreviewFlow updatePreview query error: ${err}`);
        }
    }

    /**
     * Method to update the base record
     * @param update Update values
     */
    updateBase(update) {
        let query: string = `UPDATE previewFlow SET base='${update.base}' WHERE name='${update.name}' AND album='${update.album}';`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbPreviewFlow updateBase query error: ${err}`);
        }
    }

    /**
     * Method to query all values from the previewFlow table
     */
    queryAll() {
        let query: string = 'SELECT DISTINCT * FROM previewFlow;';
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).get();
        } catch (err) {
            Logger.Log().error(`DbPreviewFlow queryAll query error: ${err}`);
        }

        return result;
    }

    /**
     * Method to query all records from a certain album
     * @param album Selected album
     */
    queryAllWhereAlbum(album) {
        let query: string = `SELECT DISTINCT * FROM previewFlow WHERE album='${album}';`;
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).all();
        } catch (err) {
            Logger.Log().error(`DbPreviewFlow queryAllWhereAlbum query error: ${err}`);
        }

        return result;
    }

    /**
     * Method to query all records from a certain album
     * @param album Selected album
     */
    queryBaseWhereName(picture) {
        let query: string = `SELECT * FROM previewFlow WHERE name LIKE '${picture}%';`
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).get();
        } catch (err) {
            Logger.Log().error(`DbPreviewFlow queryBaseWhereName query error: ${err}`);
        }

        return result;
    }

    /**
     * Delete a picture relation from the database
     * @param path Path to the picture
     */
    deletePicture(path: string) {
        let query: string = `Delete FROM previewFlow WHERE preview='${path}'`;
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbPreviewFlow deletePicture query error: ${err}`);
        }

        return result;
    }

    /**
     * Delete pictures relations located in a specified album from the database
     * @param album Album where the pictures are located in
     */
    deletePicturesWhereAlbum(album: string) {
        let query: string = `Delete FROM previewFlow WHERE album='${album}'`;
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbPreviewFlow deletePicturesWhereAlbum query error: ${err}`);
        }

        return result;
    }

    /**
     * Update album's name within the album, base and preview record
     * @param value Current album name
     * @param updated Updated album name
     */
    updateAlbum(current: IAlbum, album: IAlbum) {
        let result = null;
        let flows: IFlow = Api.getFlows(current);
        let query: string = `UPDATE previewFlow SET
            name=REPLACE(name, '${Helper.ParsePictureNameWithoutDate(path.basename(current.album))}', '${Helper.ParsePictureNameWithoutDate(path.basename(album.album))}'), 
            album=REPLACE(album,'${current.album}', '${album.album}'), 
            base=REPLACE(base, '${path.join(current.album, flows.base, Helper.ParsePictureNameWithoutDate(path.basename(current.album)))}','${path.join(album.album, flows.base, Helper.ParsePictureNameWithoutDate(path.basename(album.album)))}'),
            preview=REPLACE(preview, '${path.join(current.album, flows.preview, Helper.ParsePictureNameWithoutDate(path.basename(current.album)))}', '${path.join(album.album, flows.preview, Helper.ParsePictureNameWithoutDate(path.basename(album.album)))}');`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbPreviewFlow updateAlbum query error: ${err}`);
        }

        return result;
    }

    /**
     * Method to query all records from the baseFlow table
     * @param album Select the album where all the records will get queried
     */
    queryPreviewFlow(album: string) {
        let result = null;
        let query: string = `SELECT * FROM previewFlow where album='${album}';`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).all();
        } catch (err) {
            Logger.Log().error(`DbBaseFlow queryBaseFlow query error: ${err}`);
        }

        return result;
    }
}
