import { Logger } from '../logger/logger';
import { IAlbum } from './interfaces';
import { Sqlite } from './sqlite';

export class DbBackupFlow extends Sqlite {

    /**
     * DbBackupFlow constructor
     */
    constructor() {
        super();
    }

    /**
     * Method to create the backupFlow table
     */
    createTable() {
        let query: string = `CREATE TABLE IF NOT EXISTS backupFlow(
            "collection" varchar(400) NOT NULL,
            "album" varchar(200) NOT NULL,
            "backup" varchar(400) NOT NULL PRIMARY KEY,
            "date" varchar(10) NOT NULL,
            "time" varchar(8) NOT NULL)`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            this.connection.exec(query);
        } catch (err) {
            Logger.Log().error(`DbBackupFlow createTable query error: ${err}`);
        }
    }

    /**
     * Method to check whether the backupFlow table exists
     */
    tableExists() {
        let query: string = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='backupFlow'";
        let count = 0;

        try {
            Logger.Log().debug(`Query: ${query}`);
            count = this.connection.prepare(query).pluck().get();
        } catch (err) {
            Logger.Log().error(`DbBackupFlow tableExists query error: ${err}`);
        }

        return ((count == 1) ? true : false);
    }

    /**
     * Method to insert data into table's row
     * @param args Data needed to insert into the table's row
     */
    insertRow(args) {
        try {
            Logger.Log().debug(`Query: INSERT INTO backupFlow VALUES ("${JSON.stringify(args)}")`);
            this.connection.prepare("INSERT INTO backupFlow VALUES (@collection, @album, @backup, @date, @time);").run(args);
        } catch (err) {
            Logger.Log().error(`DbBackupFlow insertRow query error: ${err}`);
        }
    }

    /**
     * Method to query all values from the backupFlow table
     */
    queryAll() {
        let query: string = 'SELECT DISTINCT * FROM backupFlow;';
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).get();
        } catch (err) {
            Logger.Log().error(`DbBackupFlow queryAll query error: ${err}`);
        }

        return result;
    }

    /**
     * Method to query all records from the backupFlow from a specified album
     * @param album Album from which all records are queried
     */
    queryBackupFlow(album: string) {
        let query: string = `SELECT * FROM backupFlow where album='${album}';`;
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).all();
        } catch (err) {
            Logger.Log().error(`DbBackupFlow queryBackupFlow query error: ${err}`);
        }

        return result;
    }

    /**
     * Delete pictures relations located in a specified album from the database
     * @param album Album where the pictures are located in
     */
    deletePicturesWhereAlbum(album: string) {
        let query: string = `Delete FROM backupFlow WHERE album='${album}'`;
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbBackupFlow deletePicturesWhereAlbum query error: ${err}`);
        }

        return result;
    }

    /**
     * Update album's name within the album and backup record
     * @param value Current album name
     * @param updated Updated album name
     */
    updateAlbum(current: IAlbum, album: IAlbum) {
        let result = null;
        let query: string = `UPDATE backupFlow SET 
            album=REPLACE(album,'${current.album}', '${album.album}'), 
            backup=REPLACE(backup,'${current.album}', '${album.album}');`;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).run();
        } catch (err) {
            Logger.Log().error(`DbBackupFlow updateAlbum query error: ${err}`);
        }

        return result;
    }
}
