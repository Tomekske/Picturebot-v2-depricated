import { Logger } from '../logger/logger';
import { Sqlite } from './sqlite';

export class DbLibrary extends Sqlite {
    /**
     * DbLibrary constructor
     */
    constructor() {
        super();
    }
    
    /**
     * Method to create the library table
     */
    createTable() {
        let query: string = `CREATE TABLE IF NOT EXISTS Library(
            "name" varchar(200) NOT NULL, 
            "base" varchar(200) NOT NULL, 
            "library" varchar(400) NOT NULL PRIMARY KEY)`;
        
        Logger.Log().debug(`Query: ${query}`);
        this.connection.exec(query);
    }

    /**
     * Method to check whether the library table exists
     */
    tableExists() {
        let query: string = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Library'";
        const count = this.connection.prepare(query).pluck().get();

        Logger.Log().debug(`Query: ${query}`);
        return ((count == 1) ? true : false);
    }

    /**
     * Method to insert data into table's row
     * @param args Data needed to insert into the table's row
     */
    insertRow(args) {
        const stmt = this.connection.prepare("INSERT INTO Library VALUES (@name, @base, @library);");
        
        Logger.Log().debug(`Query: INSERT INTO Library VALUES ("${JSON.stringify(args)}")`);
        stmt.run(args);
    }

    /**
     * Method to query all values from the library table
     */
    queryAll() {
        let query: string = 'SELECT DISTINCT * FROM Library;';
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.get();
    }

    /**
     * Method to select all the libraries within the library table
     */
    queryLibraries() {
        let query: string = 'SELECT DISTINCT library FROM Library DESC;'
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.all();
    }
}
