import { Logger } from '../logger/logger';
import { IAlbum } from './interfaces';
import { Sqlite } from './sqlite';

export class DbAlbum extends Sqlite {

    /**
     * DbAlbum constructor
     */
    constructor() {
        super();
    }

    /**
     * Method to create the album table
     */
    createTable() {
        let query: string = `CREATE TABLE IF NOT EXISTS Album(
            "collection" varchar(250) NOT NULL,
            "name" varchar(50) NOT NULL,
            "date" date NOT NULL,
            "started" INTEGER NULL,
            "raw" INTEGER NULL,
            "album" varchar(250) NOT NULL PRIMARY KEY)`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            this.connection.exec(query);
        } catch (err) {
            Logger.Log().error(`DbAlbum createTable query error: ${err}`);
        }
    }

    /**
     * Method to check whether the album table exists
     */
    tableExists() {
        let query: string = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Album'";
        let count = 0;

        try {
            Logger.Log().debug(`Query: ${query}`);
            count = this.connection.prepare(query).pluck().get();
        } catch (err) {
            Logger.Log().error(`DbAlbum tableExists query error: ${err}`);
        }

        return ((count == 1) ? true : false);
    }

    /**
     * Method to insert data into table's row
     * @param args Data needed to insert into the table's row
     */
    insertRow(args) {
        try {
            Logger.Log().debug(`Query: INSERT INTO Album VALUES ("${JSON.stringify(args)}")`);
            this.connection.prepare(`INSERT INTO Album VALUES (@collection, @name, @date, @started, @raw, @album);`).run(args);
        } catch (err) {
            Logger.Log().error(`DbAlbum insertRow query error: ${err}`);
        }
    }

    /**
     * Method to update the started record in the table's row
     * @param isStarted Updated started value
     * @param album Select the album where the started value will get updated
     */
    updateStartedRecord(isStarted, album) {
        let query: string = `UPDATE album SET started=${isStarted} WHERE album='${album}'`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbAlbum updateStartedRecord query error: ${err}`);
        }
    }

    /**
     * Method to query all values from the album table
     */
    queryAll() {
        let query: string = 'SELECT DISTINCT * FROM Album;';
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).get();
        } catch (err) {
            Logger.Log().error(`DbAlbum queryAll query error: ${err}`);
        }

        return result;
    }

    /**
     * Method to query certain records from a specified album
     * @param collection Collection from which certain records are queried
     */
    queryAlbums(collection) {
        let query: string = `SELECT album, collection, name, date, started FROM Album WHERE collection='${collection}' ORDER BY name ASC;`;
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).all();
        } catch (err) {
            Logger.Log().error(`DbAlbum queryAlbums query error: ${err}`);
        }

        return result;
    }

    /**
     * Method to query all records from a specified album
     * @param collection Collection from which all records is queried
     */
    querySingleAlbum(collection) {
        let query: string = `SELECT * FROM Album WHERE collection='${collection}';`;
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).get();
        } catch (err) {
            Logger.Log().error(`DbAlbum querySingleAlbum query error: ${err}`);
        }

        return result;
    }

    /**
     * Method to query the started record from a specified album
     * @param album Album from which the started record is selected
     */
    queryStarted(album) {
        let query: string = `SELECT started FROM Album WHERE album='${album}';`;
        let started = 0;

        try {
            Logger.Log().debug(`Query: ${query}`);
            started = this.connection.prepare(query).pluck().get();
        } catch (err) {
            Logger.Log().error(`DbAlbum queryStarted query error: ${err}`);
        }

        return ((started == 1) ? true : false);
    }

    /**
     * Delete an album relation from the database
     * @param album Path to the picture
     */
    deleteAlbum(album: string) {
        let query: string = `Delete FROM album WHERE album='${album}'`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbAlbum deleteAlbum query error: ${err}`);
        }
    }

    /**
     * Update album's name within the album and backup record
     * @param value Current album name
     * @param updated Updated album name
     */
    updateAlbum(current: IAlbum, album: IAlbum) {
        let result = null;
        let query: string = `UPDATE album SET 
            name=REPLACE(name, '${current.name}', '${album.name}'),
            album=REPLACE(album, '${current.album}', '${album.album}');`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbBackupFlow updateAlbum query error: ${err}`);
        }

        return result;
    }
}
