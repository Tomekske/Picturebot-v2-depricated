import Database = require("better-sqlite3");
import { Logger } from '../../logger';

export abstract class Sqlite {
    protected path: string = "C:\\Users\\joost\\Documents\\Log\\food.db";
    protected connection;

    constructor() {
        Logger.Log().debug("Successfully created db");

        this.connection = new Database(this.path, { verbose: console.log });
    }

    protected abstract createTable(): void;
    protected abstract tableExists(): boolean;
    abstract insertRow(args): void;
    abstract updateRow(args): void;
    abstract queryAll();

    dbClose() {
        Logger.Log().debug('Close the database connection.');

        this.connection.close();
    }
}
