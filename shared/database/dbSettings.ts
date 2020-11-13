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
            "uploadEdited" varchar(200) NOT NULL, 
            "uploadSocialMedia" varchar(200) NOT NULL, 
            "sofwareEditing" varchar(200) NOT NULL, 
            "sofwarePostProcessing" varchar(200) NOT NULL, 
            "fileType" varchar(200) NOT NULL, 
            "logLevel" varchar(200) NOT NULL, 
            "conversion" varchar(3) NOT NULL);`;

        this.connection.exec(query);
        Logger.Log().debug(`Query: ${query}`);
    }

    /**
     * Method to check whether the settings table exists
     */
    tableExists() {
        let query: string = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Settings'";
        const count = this.connection.prepare(query).pluck().get();

        Logger.Log().debug(`Query: ${query}`);
        return ((count == 1) ? true : false);
    }

    /**
     * Method to insert data into table's row
     * @param args Data needed to insert into the table's row
     */
    insertRow(args) {
        const stmt = this.connection.prepare("INSERT INTO Settings VALUES (@uploadEdited, @uploadSocialMedia, @sofwareEditing, @sofwarePostProcessing, @fileType, @logLevel, @conversion);");
        
        stmt.run(args);
        Logger.Log().debug(`Query: INSERT INTO Settings VALUES ("${JSON.stringify(args)}")`);
    }

    /**
     * Method to update the settings records
     * @param args Updated values
     */
    updateRow(args) {
        const stmt = this.connection.prepare("UPDATE Settings set uploadEdited=@uploadEdited, uploadSocialMedia=@uploadSocialMedia, sofwareEditing = @sofwareEditing, sofwarePostProcessing=@sofwarePostProcessing, fileType=@fileType, logLevel=@logLevel, conversion=@conversion;");
        
        stmt.run(args);
        Logger.Log().debug(`Query: UPDATE Settings set "${JSON.stringify(args)}"`);
    }

    /**
     * Method to query all values from the settings table
     */
    queryAll() {
        let query: string = 'SELECT * FROM Settings';
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.get();
    }

    /**
     * Method to check whether the settings table contains records
     */
    isEmpty() {
        let query: string = "SELECT count(1) FROM Settings;";
        const count = this.connection.prepare(query).pluck().get();

        Logger.Log().debug(`Query: ${query}`);
        return ((count == 0) ? true : false);
    }

    /**
     * Method to query the conversion percentage record
     */
    queryConversion() {
        let query: string = 'SELECT conversion FROM Settings';
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.pluck().get();
    }
}
