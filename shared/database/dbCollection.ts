import { Logger } from '../logger/logger';
import { Sqlite } from './sqlite';

export class DbCollection extends Sqlite {

    /**
     * DbCollection constructor
     */
    constructor() {
        super();
    }
    
    /**
     * Method to collection the album table
     */
    createTable() {
        let query: string = `CREATE TABLE IF NOT EXISTS Collection(
            "library" varchar(200) NOT NULL, 
            "name" varchar(50) NOT NULL, 
            "backup" varchar(40), 
            "base" varchar(40) NOT NULL, 
            "preview" varchar(40) NOT NULL, 
            "edited" varchar(40) NOT NULL, 
            "socialMedia" varchar(40) NOT NULL,
            "favorites" varchar(40) NOT NULL,
            "collection" varchar(250) NOT NULL PRIMARY KEY)`;

        Logger.Log().debug(`Query: ${query}`);
        this.connection.exec(query);
    }

    /**
     * Method to check whether the collection table exists
     */
    tableExists() {
        let query: string = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Collection'";
        const count = this.connection.prepare(query).pluck().get();

        Logger.Log().debug(`Query: ${query}`);
        return ((count == 1) ? true : false);
    }

    /**
     * Method to insert data into table's row
     * @param args Data needed to insert into the table's row
     */
    insertRow(args) {
        const stmt = this.connection.prepare(`INSERT INTO Collection VALUES (
            @library, @name, @backup, @base, @preview, @edited, @socialMedia, @favorites, @collection);`
        );

        Logger.Log().debug(`Query: INSERT INTO Collection VALUES ("${JSON.stringify(args)}")`);
        stmt.run(args);
    }

    /**
     * Method to query all values from the collection table
     */
    queryAll() {
        let query: string = 'SELECT DISTINCT * FROM Collection;';
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.all();
    }

    /**
     * Method to query all values from the collection table of a specified collection
     * @param collection Selected collection
     */
    queryAllWhereCollection(collection: string) {
        let query: string = `SELECT * FROM Collection WHERE collection='${collection}';`;
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.get();
    }

    /**
     * Method to query all collections
     */
    queryCollections() {
        let query: string = 'SELECT DISTINCT collection FROM Collection DESC;';
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.all();
    }

    /**
     * Method to query certain flows from a specified collection
     * @param collection Collection from which the flows are queried
     */
    queryFlows(collection: string) {
        let query: string = `SELECT preview, favorites, edited, socialMedia FROM Collection WHERE collection='${collection}';`;
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.get();
    }

    /**
     * Method to query the base and preview record from a certain collection
     * @param collection Collection from which the records are queried
     */
    queryRenameStartedFlows(collection: string) {
        let query: string = `SELECT base, preview, backup FROM Collection WHERE collection='${collection}';`;
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.get();  
    }

    /**
     * Method to query all flows from a specified collection
     * @param collection Collection from which the flows are queried
     */
    queryAllFlows(collection: string) {
        let query: string = `SELECT backup, base, preview, edited, socialMedia, favorites FROM Collection WHERE collection='${collection}';`;
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.get();
    }
}
