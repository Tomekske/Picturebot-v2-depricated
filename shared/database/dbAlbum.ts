import * as sqlite from 'better-sqlite3';
import { Logger } from '../../logger';
import { Sqlite } from './sqlite';

export class DbAlbum extends Sqlite {

    constructor() {
        super();

        if(!this.tableExists()) {
            this.createTable();
        }
    }

    createTable() {
        this.connection.exec(`CREATE TABLE IF NOT EXISTS Album(
            "collection" varchar(250) NOT NULL,
            "name" varchar(50) NOT NULL,
            "date" date NOT NULL,
            "album" varchar(250) NOT NULL PRIMARY KEY)`
        );
    }

    tableExists() {
        const count = this.connection.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Album'").pluck().get();;
        return ((count == 1) ? true : false);
    }

    insertRow(args) {
        const stmt = this.connection.prepare(`INSERT INTO Album VALUES (
            @collection, @name, @date, @album);`
        );
        stmt.run(args);
    }

    updateRow(args) {
        const stmt = this.connection.prepare(`UPDATE Album set 
            collection=@collection, name=@name, date=@date, album=@album;`
        );
        stmt.run(args);
    }

    queryAll() {
        const stmt = this.connection.prepare('SELECT DISTINCT * FROM Album;');
        return stmt.get();
    }

    queryAlbums(collection) {
        const stmt = this.connection.prepare(`SELECT album FROM Album WHERE collection='${collection}';`);
        return stmt.all();
    }
}
