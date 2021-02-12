import { Logger } from '../logger/logger';
import { Sqlite } from './sqlite';
import * as path from 'path';
import { IAlbum, IFlow } from './interfaces';
import { Api } from './api';
import { Helper } from '../helper/helper';

export class DbEditedFlow extends Sqlite {

    /**
     * DbEditedFlow constructor
     */
    constructor() {
        super();
    }

    /**
     * Method to create the editedFlow table
     */
    createTable() {
        let query: string = `CREATE TABLE IF NOT EXISTS editedFlow(
            "collection" varchar(400) NOT NULL,
            "album" varchar(200) NOT NULL,
            "preview" varchar(400) NOT NULL,
            "base" varchar(400) NOT NULL,
            "edited" varchar(400) NOT NULL PRIMARY KEY)`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            this.connection.exec(query);
        } catch (err) {
            Logger.Log().error(`DbEditedFlow createTable query error: ${err}`);
        }
    }

    /**
     * Method to check whether the editedFlow table exists
     */
    tableExists() {
        let query: string = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='editedFlow'";
        let count = 0;

        try {
            Logger.Log().debug(`Query: ${query}`);
            count = this.connection.prepare(query).pluck().get();
        } catch (err) {
            Logger.Log().error(`DbEditedFlow tableExists query error: ${err}`);
        }

        return ((count == 1) ? true : false);
    }

    /**
     * Method to insert data into table's row
     * @param args Data needed to insert into the table's row
     */
    insertRow(args) {
        try {
            Logger.Log().debug(`Query: INSERT INTO editedFlow VALUES ("${JSON.stringify(args)}")`);
            this.connection.prepare("INSERT INTO editedFlow VALUES (@collection, @album, @preview, @base, @edited);").run(args);
        } catch (err) {
            Logger.Log().error(`DbEditedFlow insertRow query error: ${err}`);
        }
    }

    /**
     * Method to query all values from the editedFlow table
     */
    queryAll() {
        let query: string = 'SELECT DISTINCT * FROM editedFlow;';
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).get();
        } catch (err) {
            Logger.Log().error(`DbEditedFlow queryAll query error: ${err}`);
        }

        return result;
    }

    deleteWhereEdited(edited: string) {
        let query: string = `Delete FROM editedFlow WHERE edited='${edited}'`;
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbEditedFlow deleteWhereEdited query error: ${err}`);
        }

        return result;
    }

    /**
     * Method to query all records from a certain album
     * @param album Selected album
     */
    queryAllWhereAlbum(album) {
        let query: string = `SELECT DISTINCT * FROM editedFlow WHERE album='${album}' ORDER BY preview ASC;`;
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).all();
        } catch (err) {
            Logger.Log().error(`DbEditedFlow queryAllWhereAlbum query error: ${err}`);
        }

        return result;
    }

    /**
     * Delete pictures relations located in a specified album from the database
     * @param album Album where the pictures are located in
     */
    deletePicturesWhereAlbum(album: string) {
        let query: string = `Delete FROM editedFlow WHERE album='${album}'`;
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbEditedFlow deletePicturesWhereAlbum query error: ${err}`);
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
        let query: string = `UPDATE editedFlow SET 
            album=REPLACE(album,'${current.album}', '${album.album}'), 
            base=REPLACE(base, '${path.join(current.album, flows.base, Helper.ParsePictureNameWithoutDate(path.basename(current.album)))}','${path.join(album.album, flows.base, Helper.ParsePictureNameWithoutDate(path.basename(album.album)))}'),
            preview=REPLACE(preview, '${path.join(current.album, flows.preview, Helper.ParsePictureNameWithoutDate(path.basename(current.album)))}', '${path.join(album.album, flows.preview, Helper.ParsePictureNameWithoutDate(path.basename(album.album)))}'), 
            edited=REPLACE(edited, '${path.join(current.album, flows.edited, Helper.ParsePictureNameWithoutDate(path.basename(current.album)))}', '${path.join(album.album, flows.edited, Helper.ParsePictureNameWithoutDate(path.basename(album.album)))}');`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbEditedFlow updateAlbum query error: ${err}`);
        }

        return result;
    }

    /**
     * Method to query all records from the baseFlow table
     * @param album Select the album where all the records will get queried
     */
    queryEditedFlow(album: string) {
        let result = null;
        let query: string = `SELECT * FROM editedFlow where album='${album}' ORDER BY preview ASC;;`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).all();
        } catch (err) {
            Logger.Log().error(`DbBaseFlow queryBaseFlow query error: ${err}`);
        }

        return result;
    }
}
