import * as sqlite from 'better-sqlite3';
import { Logger } from '../../logger';
import { Sqlite } from './sqlite';

export class Album extends Sqlite {
    createTable(dbCon) {
        dbCon.exec(`CREATE TABLE IF NOT EXISTS Album(
            "collection" varchar(250) NOT NULL,
            "name" varchar(50) NOT NULL,
            "date" date NOT NULL,
            "path" varchar(250) NOT NULL PRIMARY KEY)`
        );
    }

    tableExists(dbCon) {
        const count = dbCon.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Album'").pluck().get();;
        return ((count == 1) ? true : false);
    }

    insertRow(dbCon, args) {
        const stmt = dbCon.prepare(`INSERT INTO Album VALUES (
            @collection, @name, @date, @path);`
        );
        stmt.run(args);
    }

    updateRow(dbCon, args) {
        const stmt = dbCon.prepare(`UPDATE Album set 
            collection=@collection, name=@name, date=@date, path=@path;`
        );
        stmt.run(args);
    }

    queryAll(dbCon) {
        const stmt = dbCon.prepare('SELECT DISTINCT * FROM Album;');
        return stmt.get();
    }
}
