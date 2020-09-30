import * as sqlite from 'better-sqlite3';
import { Logger } from '../../logger';
import { Sqlite } from './sqlite';

export class Library extends Sqlite {
    createTable(dbCon) {
        dbCon.exec(`CREATE TABLE IF NOT EXISTS Library(
            "name" varchar(200) NOT NULL, 
            "base" varchar(200) NOT NULL, 
            "path" varchar(400) NOT NULL PRIMARY KEY)`
        );
    }

    tableExists(dbCon) {
        const count = dbCon.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Library'").pluck().get();;
        return ((count == 1) ? true : false);
    }

    insertRow(dbCon, args) {
        const stmt = dbCon.prepare("INSERT INTO Library VALUES (@name, @base, @path);");
        stmt.run(args);
    }

    updateRow(dbCon, args) {
        const stmt = dbCon.prepare("UPDATE Library set name=@name, base=@base, path=@path;");
        stmt.run(args);
    }

    queryAll(dbCon) {
        const stmt = dbCon.prepare('SELECT DISTINCT * FROM Library;');
        return stmt.get();
    }

    queryLibraries(dbCon) {
        const stmt = dbCon.prepare('SELECT DISTINCT path FROM Library DESC;');
        return stmt.all();
    }
}
