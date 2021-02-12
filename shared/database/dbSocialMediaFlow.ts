import { Logger } from '../logger/logger';
import { Sqlite } from './sqlite';
import * as path from 'path';
import { IAlbum, IFlow } from './interfaces';
import { Api } from './api';
import { Helper } from '../helper/helper';

export class DbSocialMediaFlow extends Sqlite {

    /**
     * DbSocialMediaFlow constructor
     */
    constructor() {
        super();
    }

    /**
     * Method to create the socialMediaFlow table
     */
    createTable() {
        let query: string = `CREATE TABLE IF NOT EXISTS socialMediaFlow(
            "collection" varchar(400) NOT NULL,
            "album" varchar(200) NOT NULL,
            "preview" varchar(400) NOT NULL,
            "base" varchar(400) NOT NULL,
            "socialMedia" varchar(400) NOT NULL PRIMARY KEY)`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            this.connection.exec(query);
        } catch (err) {
            Logger.Log().error(`DbSocialMediaFlow createTable query error: ${err}`);
        }
    }

    /**
     * Method to check whether the socialMediaFlow table exists
     */
    tableExists() {
        let query: string = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='socialMediaFlow'";
        let count = 0;

        try {
            Logger.Log().debug(`Query: ${query}`);
            count = this.connection.prepare(query).pluck().get();
        } catch (err) {
            Logger.Log().error(`DbSocialMediaFlow tableExists query error: ${err}`);
        }

        return ((count == 1) ? true : false);
    }

    /**
     * Method to insert data into table's row
     * @param args Data needed to insert into the table's row
     */
    insertRow(args) {
        try {
            Logger.Log().debug(`Query: INSERT INTO socialMediaFlow VALUES ("${JSON.stringify(args)}")`);
            this.connection.prepare("INSERT INTO socialMediaFlow VALUES (@collection, @album, @preview, @base, @socialMedia);").run(args);
        } catch (err) {
            Logger.Log().error(`DbSocialMediaFlow insertRow query error: ${err}`);
        }
    }

    /**
     * Method to query all values from the socialMediaFlow table
     */
    queryAll() {
        let query: string = 'SELECT DISTINCT * FROM socialMediaFlow;';
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).get();
        } catch (err) {
            Logger.Log().error(`DbSocialMediaFlow queryAll query error: ${err}`);
        }

        return result;
    }

    /**
     * Delete a social-media picture entry from the database
     * @param socialMedia Social-media object
     */
    deleteWhereSocialMedia(socialMedia: string) {
        let query: string = `Delete FROM socialMediaFlow WHERE socialMedia='${socialMedia}'`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbSocialMediaFlow deleteWhereSocialMedia query error: ${err}`);
        }
    }

    /**
     * Method to query all records from a certain album
     * @param album Selected album
     */
    queryAllWhereAlbum(album) {
        let query: string = `SELECT DISTINCT * FROM socialMediaFlow WHERE album='${album}' ORDER BY preview ASC;`;
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).all();
        } catch (err) {
            Logger.Log().error(`DbSocialMediaFlow queryAllWhereAlbum query error: ${err}`);
        }

        return result;
    }

    /**
     * Delete pictures relations located in a specified album from the database
     * @param album Album where the pictures are located in
     */
    deletePicturesWhereAlbum(album: string) {
        let query: string = `Delete FROM socialMediaFlow WHERE album='${album}'`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbSocialMediaFlow deletePicturesWhereAlbum query error: ${err}`);
        }
    }

    /**
     * Update album's name within the album, base, preview and social-media record
     * @param value Current album name
     * @param updated Updated album name
     */
    updateAlbum(current: IAlbum, album: IAlbum) {
        let result = null;
        let flows: IFlow = Api.getFlows(current);
        let query: string = `UPDATE socialMediaFlow SET 
            album=REPLACE(album,'${current.album}', '${album.album}'), 
            base=REPLACE(base, '${path.join(current.album, flows.base, Helper.ParsePictureNameWithoutDate(path.basename(current.album)))}','${path.join(album.album, flows.base, Helper.ParsePictureNameWithoutDate(path.basename(album.album)))}'),
            preview=REPLACE(preview, '${path.join(current.album, flows.preview, Helper.ParsePictureNameWithoutDate(path.basename(current.album)))}', '${path.join(album.album, flows.preview, Helper.ParsePictureNameWithoutDate(path.basename(album.album)))}'), 
            socialMedia=REPLACE(socialMedia, '${path.join(current.album, flows.socialMedia, Helper.ParsePictureNameWithoutDate(path.basename(current.album)))}', '${path.join(album.album, flows.socialMedia, Helper.ParsePictureNameWithoutDate(path.basename(album.album)))}');`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbSocialMediaFlow updateAlbum query error: ${err}`);
        }

        return result;
    }

    /**
     * Method to query all records from the baseFlow table
     * @param album Select the album where all the records will get queried
     */
    queryEditedFlow(album: string) {
        let result = null;
        let query: string = `SELECT * FROM socialMediaFlow where album='${album}' ORDER BY preview ASC;`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).all();
        } catch (err) {
            Logger.Log().error(`DbBaseFlow queryBaseFlow query error: ${err}`);
        }

        return result;
    }
}
