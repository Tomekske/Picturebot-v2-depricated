import { Logger } from '../logger/logger';
import { Sqlite } from './sqlite';
import * as path from 'path';
import { IAlbum, IFlow } from './interfaces';
import { Api } from './api';
import { Helper } from '../helper/helper';

export class DbFavoriteFlow extends Sqlite {

    /**
     * DbFavoriteFlow constructor
     */
    constructor() {
        super();
    }

    /**
     * Method to create the favoriteFlow table
     */
    createTable() {
        let query: string = `CREATE TABLE IF NOT EXISTS favoriteFlow(
            "collection" varchar(400) NOT NULL,
            "album" varchar(200) NOT NULL,
            "preview" varchar(400) NOT NULL,
            "base" varchar(400) NOT NULL PRIMARY KEY)`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            this.connection.exec(query);
        } catch (err) {
            Logger.Log().error(`DbFavoriteFlow createTable query error: ${err}`);
        }
    }

    /**
     * Method to check whether the favoriteFlow table exists
     */
    tableExists() {
        let query: string = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='favoriteFlow'";
        let count = 0;

        try {
            Logger.Log().debug(`Query: ${query}`);
            count = this.connection.prepare(query).pluck().get();
        } catch (err) {
            Logger.Log().error(`DbFavoriteFlow tableExists query error: ${err}`);
        }

        return ((count == 1) ? true : false);
    }

    /**
     * Method to insert data into table's row
     * @param args Data needed to insert into the table's row
     */
    insertRow(args) {
        try {
            Logger.Log().debug(`Query: INSERT INTO favoriteFlow VALUES ("${JSON.stringify(args)}")`);
            this.connection.prepare("INSERT INTO favoriteFlow VALUES (@collection, @album, @preview, @base);").run(args);
        } catch (err) {
            Logger.Log().error(`DbFavoriteFlow insertRow query error: ${err}`);
        }
    }

    /**
     * Method to query all values from the favoriteFlow table
     */
    queryAll() {
        let query: string = 'SELECT DISTINCT * FROM favoriteFlow ORDER BY preview ASC;';
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).get();
        } catch (err) {
            Logger.Log().error(`DbFavoriteFlow queryAll query error: ${err}`);
        }

        return result;
    }

    /**
     * Delete pictures relations located in a specified album from the database
     * @param album Album where the pictures are located in
     */
    deletePicturesWhereAlbum(album: string) {
        let query: string = `Delete FROM favoriteFlow WHERE album='${album}'`;
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbFavoriteFlow deletePicturesWhereAlbum query error: ${err}`);
        }

        return result;
    }

    /**
     * Delete a favorited picture from the favorite flow
     * @param base Selected base location
     */
    deletePictureWhereBase(base: string) {
        let query: string = `Delete FROM favoriteFlow WHERE base='${base}'`;
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbFavoriteFlow deletePictureWhereBase query error: ${err}`);
        }

        return result;
    }

    /**
     * Delete a picture relation from the database
     * @param path Path to the picture
     */
    deletePicture(path: string) {
        let query: string = `Delete FROM favoriteFlow WHERE preview='${path}';`;
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbFavoriteFlow deletePicture query error: ${err}`);
        }

        return result;
    }

    /**
     * Method to query all records from a certain album
     * @param album Selected album
     */
    queryAllWhereAlbum(album) {
        let query: string = `SELECT DISTINCT * FROM favoriteFlow WHERE album='${album}' ORDER BY preview ASC;`;
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).all();
        } catch (err) {
            Logger.Log().error(`DbFavoriteFlow queryAllWhereAlbum query error: ${err}`);
        }

        return result;
    }

    /**
     * Update album's name within the album, base, preview and social-media record
     * @param value Current album name
     * @param updated Updated album name
     */
    updateAlbum(current: IAlbum, album: IAlbum) {
        let result = null;
        let flows: IFlow = Api.getFlows(current);
        let query: string = `UPDATE favoriteFlow SET 
            album=REPLACE(album,'${current.album}', '${album.album}'), 
            base=REPLACE(base, '${path.join(current.album, flows.base, Helper.ParsePictureNameWithoutDate(path.basename(current.album)))}','${path.join(album.album, flows.base, Helper.ParsePictureNameWithoutDate(path.basename(album.album)))}'),
            preview=REPLACE(preview, '${path.join(current.album, flows.preview, Helper.ParsePictureNameWithoutDate(path.basename(current.album)))}', '${path.join(album.album, flows.preview, Helper.ParsePictureNameWithoutDate(path.basename(album.album)))}')`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbSocialMediaFlow updateAlbum query error: ${err}`);
        }

        return result;
    }
}
