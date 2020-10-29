import Database = require("better-sqlite3");
import { Logger } from '../logger/logger';
import { Helper } from '../helper/helper';
import * as path from 'path';

export abstract class Sqlite {
    protected path: string = path.join(Helper.pathMyDocuments(), Helper.app, "database.db");
    protected connection;

    /**
     * Base constructor for derived classes 
     */
    constructor() {
        this.connection = new Database(this.path, { verbose: console.log });

        // Create table when it doesn't exists
        if(!this.tableExists()) {
            this.createTable();
        }
    }

    protected abstract createTable(): void;
    protected abstract tableExists(): boolean;
    abstract insertRow(args): void;
    abstract queryAll();

    /**
     * Close the database
     */
    dbClose() {
        Logger.Log().debug('Close the database connection.');
        this.connection.close();
    }
}
