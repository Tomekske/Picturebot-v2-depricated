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
        
        try {
            Logger.Log().debug(`Query: ${query}`);
            this.connection.exec(query);
        } catch(err) {
            Logger.Log().error(`DbLibrary createTable query error: ${err}`);
        }
    }

    /**
     * Method to check whether the library table exists
     */
    tableExists() {
        let query: string = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Library'";
        let count = 0;

        try {
            Logger.Log().debug(`Query: ${query}`);
            count = this.connection.prepare(query).pluck().get();        
        } catch(err) {
            Logger.Log().error(`DbLibrary tableExists query error: ${err}`);
        }

        return ((count == 1) ? true : false);
    }

    /**
     * Method to insert data into table's row
     * @param args Data needed to insert into the table's row
     */
    insertRow(args) {
        try {
            Logger.Log().debug(`Query: INSERT INTO Library VALUES ("${JSON.stringify(args)}")`);
            this.connection.prepare("INSERT INTO Library VALUES (@name, @base, @library);").run(args);
        } catch(err) {
            Logger.Log().error(`DbLibrary insertRow query error: ${err}`);
        }
    }

    /**
     * Method to query all values from the library table
     */
    queryAll() {
        let query: string = 'SELECT DISTINCT * FROM Library;';
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).get();   
        } catch(err) {
            Logger.Log().error(`DbLibrary queryAll query error: ${err}`);
        }

        return result;
    }

    /**
     * Method to select all the libraries within the library table
     */
    queryLibraries() {
        let query: string = 'SELECT DISTINCT library FROM Library DESC;'
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).all();   
        } catch(err) {
            Logger.Log().error(`DbLibrary queryLibraries query error: ${err}`);
        }

        return result;
    }
}
