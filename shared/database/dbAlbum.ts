import { Logger } from '../logger/logger';
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
            "album" varchar(250) NOT NULL PRIMARY KEY)`;

        Logger.Log().debug(`Query: ${query}`);
        this.connection.exec(query);
    }
    
    /**
     * Method to check whether the album table exists
     */
    tableExists() {
        let query: string = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Album'";
        const count = this.connection.prepare(query).pluck().get();

        Logger.Log().debug(`Query: ${query}`);
        return ((count == 1) ? true : false);
    }

    /**
     * Method to insert data into table's row
     * @param args Data needed to insert into the table's row
     */
    insertRow(args) {
        const stmt = this.connection.prepare(`INSERT INTO Album VALUES (
            @collection, @name, @date, @started, @album);`
        );

        Logger.Log().debug(`Query: INSERT INTO Album VALUES ("${JSON.stringify(args)}")`);
        stmt.run(args);
    }

    /**
     * Method to update the started record in the table's row
     * @param isStarted Updated started value
     * @param album Select the album where the started value will get updated
     */
    updateStartedRecord(isStarted, album) {
        let query: string = `UPDATE album SET started=${isStarted} WHERE album='${album}'`;
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        stmt.run();
    }

    /**
     * Method to query all values from the album table
     */
    queryAll() {
        let query: string = 'SELECT DISTINCT * FROM Album;';
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.get();
    }

    /**
     * Method to query certain records from a specified album
     * @param collection Collection from which certain records are queried
     */
    queryAlbums(collection) {
        let query: string = `SELECT album, collection, name, date, started FROM Album WHERE collection='${collection}' ORDER BY name ASC;`;
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.all();
    }

    /**
     * Method to query all records from a specified album
     * @param collection Collection from which all records is queried
     */
    querySingleAlbum(collection) {
        let query: string = `SELECT * FROM Album WHERE collection='${collection}';`;
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.get();
    }

    /**
     * Method to query the started record from a specified album
     * @param album Album from which the started record is selected
     */
    queryStarted(album) {
        let query: string = `SELECT started FROM Album WHERE album='${album}';`;
        const started = this.connection.prepare(query).pluck().get();

        Logger.Log().debug(`Query: ${query}`);
        return ((started == 1) ? true : false);
    }

    /**
     * Delete an album relation from the database
     * @param album Path to the picture
     */
    deleteAlbum(album: string) {
        let query: string = `Delete FROM album WHERE album='${album}'`;
        const stmt = this.connection.prepare(query);
        
        Logger.Log().debug(`Query: ${query}`);
        stmt.run();
    }
}
