import { Logger } from '../logger/logger';
import { Sqlite } from './sqlite';

export class DbSettings extends Sqlite {
    /**
     * DbSettings constructor
     */
    constructor() {
        super();
    }
    
    /**
     * Method to create the settings table
     */
    createTable() {
        let query: string = `CREATE TABLE IF NOT EXISTS Settings(
            "uploadEdited" varchar(200), 
            "uploadSocialMedia" varchar(200), 
            "sofwarePostProcessing" varchar(200), 
            "conversion" varchar(3));`;
        
        try {
            Logger.Log().debug(`Query: ${query}`);
            this.connection.exec(query);
        } catch(err) {
            Logger.Log().error(`DbSettings createTable query error: ${err}`);
        }
    }

    /**
     * Method to check whether the settings table exists
     */
    tableExists() {
        let query: string = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Settings'";
        let count = 0;

        try {
            Logger.Log().debug(`Query: ${query}`);
            count = this.connection.prepare(query).pluck().get();        
        } catch(err) {
            Logger.Log().error(`DbSettings tableExists query error: ${err}`);
        }

        return ((count == 1) ? true : false);
    }

    /**
     * Method to insert data into table's row
     * @param args Data needed to insert into the table's row
     */
    insertRow(args) {
        try {
            Logger.Log().debug(`Query: INSERT INTO Settings VALUES ("${JSON.stringify(args)}")`);
            this.connection.prepare("INSERT INTO Settings VALUES (@uploadEdited, @uploadSocialMedia, @sofwarePostProcessing, @conversion);").run(args);
        } catch(err) {
            Logger.Log().error(`DbSettings insertRow query error: ${err}`);
        }
    }

    /**
     * Method to update the settings records
     * @param args Updated values
     */
    updateRow(args) {
        try {
            Logger.Log().debug(`Query: UPDATE Settings set "${JSON.stringify(args)}"`);     
            this.connection.prepare("UPDATE Settings set uploadEdited=@uploadEdited, uploadSocialMedia=@uploadSocialMedia, sofwarePostProcessing=@sofwarePostProcessing, conversion=@conversion;").run(args);   
        } catch(err) {
            Logger.Log().error(`DbSettings updateRow query error: ${err}`);
        }
    }

    /**
     * Method to query all values from the settings table
     */
    queryAll() {
        let query: string = 'SELECT * FROM Settings';
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).get();   
        } catch(err) {
            Logger.Log().error(`DbSettings queryAll query error: ${err}`);
        }

        return result;
    }

    /**
     * Method to check whether the settings table contains records
     */
    isEmpty() {
        let query: string = "SELECT count(1) FROM Settings;";
        let count = 0;

        try {
            Logger.Log().debug(`Query: ${query}`);
            count = this.connection.prepare(query).pluck().get();
        } catch(err) {
            Logger.Log().error(`DbSettings isEmpty query error: ${err}`);
        }

        return ((count == 1) ? true : false);
    }

    /**
     * Method to query the conversion percentage record
     */
    queryConversion() {
        let query: string = 'SELECT conversion FROM Settings';
        let result = null;

        try {
            Logger.Log().debug(`Query: ${query}`);
            result = this.connection.prepare(query).pluck().get();   
        } catch(err) {
            Logger.Log().error(`DbSettings queryConversion query error: ${err}`);
        }

        return result;
    }
}
