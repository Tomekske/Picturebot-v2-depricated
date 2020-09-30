import Database = require("better-sqlite3");
import { Logger } from '../../logger';

export abstract class Sqlite {
    path: string = "C:\\Users\\joost\\Documents\\Log\\food.db";

    constructor() {
    }

    abstract createTable(db): void;
    abstract tableExists(db): boolean;
    abstract insertRow(db, args): void;
    abstract updateRow(db, args): void;
    abstract queryAll(db);

    dbConnection() {
        Logger.Log().debug("Successfully created db");
        
        return new Database(this.path, { verbose: console.log });
    }

    dbClose(db) {
        db.close();
        Logger.Log().debug('Close the database connection.');
    }
}
