import * as sqlite from 'better-sqlite3';
import { Logger } from '../../logger';
import { Sqlite } from './sqlite';

export class DbLibrary extends Sqlite {
    constructor() {
        super();
        
        if(!this.tableExists()) {
            this.createTable();
        }
    }
    
    createTable() {
        this.connection.exec(`CREATE TABLE IF NOT EXISTS Library(
            "name" varchar(200) NOT NULL, 
            "base" varchar(200) NOT NULL, 
            "library" varchar(400) NOT NULL PRIMARY KEY)`
        );
    }

    tableExists() {
        const count = this.connection.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Library'").pluck().get();;
        return ((count == 1) ? true : false);
    }

    insertRow(args) {
        const stmt = this.connection.prepare("INSERT INTO Library VALUES (@name, @base, @library);");
        stmt.run(args);
    }

    updateRow(args) {
        const stmt = this.connection.prepare("UPDATE Library set name=@name, base=@base, library=@library;");
        stmt.run(args);
    }

    queryAll() {
        const stmt = this.connection.prepare('SELECT DISTINCT * FROM Library;');
        return stmt.get();
    }

    queryLibraries() {
        const stmt = this.connection.prepare('SELECT DISTINCT library FROM Library DESC;');
        return stmt.all();
    }
}
