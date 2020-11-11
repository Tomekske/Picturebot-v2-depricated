import * as sqlite from 'better-sqlite3';
import { Logger } from '../logger/logger';
import { Sqlite } from './sqlite';

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

        this.connection.exec(query);
        Logger.Log().debug(`Query: ${query}`);
    }

    /**
     * Method to check whether the previewFlow table exists
     */
    tableExists() {
        let query: string = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='previewFlow'";
        const count = this.connection.prepare(query).pluck().get();

        Logger.Log().debug(`Query: ${query}`);
        return ((count == 1) ? true : false);
    }

    /**
     * Method to insert data into table's row
     * @param args Data needed to insert into the table's row
     */
    insertRow(args) {
        const stmt = this.connection.prepare("INSERT INTO PreviewFlow VALUES (@collection, @name, @album, @base, @preview, @date, @time);");

        stmt.run(args);
        Logger.Log().debug(`Query: INSERT INTO PreviewFlow VALUES ("${JSON.stringify(args)}")`);
    }

    /**
     * Method to update the name record
     * @param update Updated values
     */
    updateName(update) {
        let query: string = `UPDATE previewFlow SET name='${update.name}' WHERE preview='${update.destination}' AND album='${update.album}';`;
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        stmt.run();
    }

    /**
     * Method to update the destination record
     * @param update Updated values
     */
    updateDestination(update) {
        let query: string = `UPDATE previewFlow SET preview='${update.dest}' WHERE name='${update.name}' AND album='${update.album}';`;
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        stmt.run();
    }

    /**
     * Method to query all values from the previewFlow table
     */
    queryAll() {
        let query: string = 'SELECT DISTINCT * FROM previewFlow;';
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.get();
    }

    /**
     * Method to query all records from a certain album
     * @param album Selected album
     */
    queryAllWhereAlbum(album) {
        let query: string = `SELECT DISTINCT * FROM previewFlow WHERE album='${album}';`;
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.all();
    }
}
