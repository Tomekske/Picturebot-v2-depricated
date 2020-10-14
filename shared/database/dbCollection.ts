import * as sqlite from 'better-sqlite3';
import { Logger } from '../../logger';
import { Sqlite } from './sqlite';

export class DbCollection extends Sqlite {
    constructor() {
        super();
        
        if(!this.tableExists()) {
            this.createTable();
        }
    }
    
    createTable() {
        this.connection.exec(`CREATE TABLE IF NOT EXISTS Collection(
            "library" varchar(200) NOT NULL, 
            "name" varchar(50) NOT NULL, 
            "backup" varchar(40), 
            "base" varchar(40) NOT NULL, 
            "preview" varchar(40) NOT NULL, 
            "files" varchar(40) NOT NULL, 
            "edited" varchar(40) NOT NULL, 
            "socialMedia" varchar(40) NOT NULL,
            "selection" varchar(40) NOT NULL,
            "collection" varchar(250) NOT NULL PRIMARY KEY)`
        );
    }

    tableExists() {
        const count = this.connection.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Collection'").pluck().get();;
        return ((count == 1) ? true : false);
    }

    insertRow(args) {
        const stmt = this.connection.prepare(`INSERT INTO Collection VALUES (
            @library, @name, @backup, @base, @preview, @files, @edited, @socialMedia, @selection, @collection);`
        );
        stmt.run(args);
    }

    updateRow(args) {
        const stmt = this.connection.prepare(`UPDATE Collection set 
            library=@library, name=@name, base=@base, preview=@preview, files=@files, edited=@edited, socialMedia=@socialMedia, selection=@selection, base=@base, collection=@collection;`
        );
        stmt.run(args);
    }

    queryAll() {
        const stmt = this.connection.prepare('SELECT DISTINCT * FROM Collection;');
        return stmt.all();
    }

    queryCollections() {
        const stmt = this.connection.prepare('SELECT DISTINCT collection FROM Collection DESC;');
        return stmt.all();
    }

    queryFlows(collection: string) {
        const q = `SELECT backup, base, preview, files, edited, socialMedia, selection FROM Collection WHERE collection='${collection}';`;
        console.log(`QUERY === ${q}`);
        const stmt = this.connection.prepare(`SELECT preview, edited, socialMedia FROM Collection WHERE collection='${collection}';`);
        return stmt.get();
    }
}
