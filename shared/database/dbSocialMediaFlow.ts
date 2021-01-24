import { Logger } from '../logger/logger';
import { Sqlite } from './sqlite';

export class DbSocialMediaFlow extends Sqlite {

    /**
     * DbSocialMediaFlow constructor
     */
    constructor() {
        super();
    }

    /**
     * Method to create the socialMediaFlow table
     */
    createTable() {
        let query: string = `CREATE TABLE IF NOT EXISTS socialMediaFlow(
            "collection" varchar(400) NOT NULL,
            "album" varchar(200) NOT NULL,
            "preview" varchar(400) NOT NULL,
            "base" varchar(400) NOT NULL,
            "socialMedia" varchar(400) NOT NULL PRIMARY KEY)`;

        Logger.Log().debug(`Query: ${query}`);
        this.connection.exec(query);
    }

    /**
     * Method to check whether the socialMediaFlow table exists
     */
    tableExists() {
        let query: string = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='socialMediaFlow'";
        const count = this.connection.prepare(query).pluck().get();

        Logger.Log().debug(`Query: ${query}`);
        return ((count == 1) ? true : false);
    }

    /**
     * Method to insert data into table's row
     * @param args Data needed to insert into the table's row
     */
    insertRow(args) {
        const stmt = this.connection.prepare("INSERT INTO socialMediaFlow VALUES (@collection, @album, @preview, @base, @socialMedia);");
        
        Logger.Log().debug(`Query: INSERT INTO socialMediaFlow VALUES ("${JSON.stringify(args)}")`);
        stmt.run(args);
    }

    /**
     * Method to query all values from the socialMediaFlow table
     */
    queryAll() {
        let query: string = 'SELECT DISTINCT * FROM socialMediaFlow;';
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.get();
    }

    deleteWhereSocialMedia(socialMedia: string) {
        let query: string = `Delete FROM socialMediaFlow WHERE socialMedia='${socialMedia}'`;
        const stmt = this.connection.prepare(query);
        
        Logger.Log().debug(`Query: ${query}`);
        stmt.run();
    }

    /**
     * Method to query all records from a certain album
     * @param album Selected album
     */
    queryAllWhereAlbum(album) {
        let query: string = `SELECT DISTINCT * FROM socialMediaFlow WHERE album='${album}';`;
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.all();
    }
}
