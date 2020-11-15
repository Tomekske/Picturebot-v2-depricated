import { Logger } from '../logger/logger';
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
            "name" varchar(200) NOT NULL,
            "album" varchar(200) NOT NULL,
            "base" varchar(400) NOT NULL,
            "backup" varchar(400) NOT NULL PRIMARY KEY,
            "date" varchar(10) NOT NULL,
            "time" varchar(8) NOT NULL)`;

        this.connection.exec(query);
        Logger.Log().debug(`Query: ${query}`);
    }

    /**
     * Method to check whether the backupFlow table exists
     */
    tableExists() {
        let query: string = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='backupFlow'";
        const count = this.connection.prepare(query).pluck().get();

        Logger.Log().debug(`Query: ${query}`);
        return ((count == 1) ? true : false);
    }

    /**
     * Method to insert data into table's row
     * @param args Data needed to insert into the table's row
     */
    insertRow(args) {
        const stmt = this.connection.prepare("INSERT INTO backupFlow VALUES (@collection, @name, @album, @base, @backup, @date, @time);");

        stmt.run(args);
        Logger.Log().debug(`Query: INSERT INTO backupFlow VALUES ("${JSON.stringify(args)}")`);
    }

    /**
     * Method to query all values from the backupFlow table
     */
    queryAll() {
        let query: string = 'SELECT DISTINCT * FROM backupFlow;';
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.get();
    }

    /**
     * Method to query all records from the backupFlow from a specified album
     * @param album Album from which all records are queried
     */
    queryBackupFlow(album: string) {
        let query: string = `SELECT * FROM backupFlow where album='${album}';`;
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.all();  
    }

    /**
     * Delete pictures relations located in a specified album from the database
     * @param album Album where the pictures are located in
     */
    deletePicturesWhereAlbum(album: string) {
        let query: string = `Delete FROM backupFlow WHERE album='${album}'`;
        const stmt = this.connection.prepare(query);
        
        Logger.Log().debug(`Query: ${query}`);
        stmt.run();
    }
}
