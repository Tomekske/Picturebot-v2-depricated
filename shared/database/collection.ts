import * as sqlite from 'better-sqlite3';
import { Logger } from '../../logger';
import { Sqlite } from './sqlite';

export class Collection extends Sqlite {
    createTable(dbCon) {
        dbCon.exec(`CREATE TABLE IF NOT EXISTS Collection(
            "library" varchar(200) NOT NULL, 
            "name" varchar(50) NOT NULL, 
            "backup" varchar(40), 
            "base" varchar(40) NOT NULL, 
            "preview" varchar(40) NOT NULL, 
            "files" varchar(40) NOT NULL, 
            "edited" varchar(40) NOT NULL, 
            "socialMedia" varchar(40) NOT NULL,
            "selection" varchar(40) NOT NULL,
            "path" varchar(250) NOT NULL PRIMARY KEY)`
        );
    }

    tableExists(dbCon) {
        const count = dbCon.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Collection'").pluck().get();;
        return ((count == 1) ? true : false);
    }

    insertRow(dbCon, args) {
        const stmt = dbCon.prepare(`INSERT INTO Collection VALUES (
            @library, @name, @backup, @base, @preview, @files, @edited, @socialMedia, @selection, @path);`
        );
        stmt.run(args);
    }

    updateRow(dbCon, args) {
        const stmt = dbCon.prepare(`UPDATE Collection set 
            library=@library, name=@name, base=@base, preview=@preview, files=@files, edited=@edited, socialMedia=@socialMedia, selection=@selection, base=@base, path=@path;`
        );
        stmt.run(args);
    }

    queryAll(dbCon) {
        const stmt = dbCon.prepare('SELECT DISTINCT * FROM Collection;');
        return stmt.get();
    }

    queryCollections(dbCon) {
        const stmt = dbCon.prepare('SELECT DISTINCT path FROM Collection DESC;');
        return stmt.all();
    }

    queryFlows(dbCon, path) {
        const q = `SELECT backup, base, preview, files, edited, socialMedia, selection FROM Collection WHERE path='${path}';`;
        console.log(`QUERY === ${q}`);
        const stmt = dbCon.prepare(`SELECT backup, base, preview, files, edited, socialMedia, selection FROM Collection WHERE path='${path}';`);
        return stmt.get();
    }
}
