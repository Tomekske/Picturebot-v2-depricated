import { Logger } from '../logger/logger';
import { Sqlite } from './sqlite';

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

        Logger.Log().debug(`Query: ${query}`);
        this.connection.exec(query);
    }

    /**
     * Method to check whether the editedFlow table exists
     */
    tableExists() {
        let query: string = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='editedFlow'";
        const count = this.connection.prepare(query).pluck().get();

        Logger.Log().debug(`Query: ${query}`);
        return ((count == 1) ? true : false);
    }

    /**
     * Method to insert data into table's row
     * @param args Data needed to insert into the table's row
     */
    insertRow(args) {
        const stmt = this.connection.prepare("INSERT INTO editedFlow VALUES (@collection, @album, @preview, @base, @edited);");
        
        Logger.Log().debug(`Query: INSERT INTO editedFlow VALUES ("${JSON.stringify(args)}")`);
        stmt.run(args);
    }

    /**
     * Method to query all values from the editedFlow table
     */
    queryAll() {
        let query: string = 'SELECT DISTINCT * FROM editedFlow;';
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.get();
    }

    deleteWhereEdited(edited: string) {
        let query: string = `Delete FROM editedFlow WHERE edited='${edited}'`;
        const stmt = this.connection.prepare(query);
        
        Logger.Log().debug(`Query: ${query}`);
        stmt.run();
    }

    /**
     * Method to query all records from a certain album
     * @param album Selected album
     */
    queryAllWhereAlbum(album) {
        let query: string = `SELECT DISTINCT * FROM editedFlow WHERE album='${album}';`;
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.all();
    }
}
