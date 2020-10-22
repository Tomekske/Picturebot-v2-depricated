import * as sqlite from 'better-sqlite3';
import { Logger } from '../../logger';
import { Sqlite } from './sqlite';

export class DbPreviewFlow extends Sqlite {
    constructor() {
        super();
        
        if(!this.tableExists()) {
            this.createTable();
        }
    }

    createTable() {
        this.connection.exec(`CREATE TABLE IF NOT EXISTS previewFlow(
            "collection" varchar(400) NOT NULL,
            "name" varchar(200) NOT NULL,
            "album" varchar(200) NOT NULL,
            "base" varchar(400) NOT NULL,
            "preview" varchar(400) NOT NULL PRIMARY KEY)`
        );
    }

    tableExists() {
        const count = this.connection.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='previewFlow'").pluck().get();;
        return ((count == 1) ? true : false);
    }

    updateName(update) {
        const stmt = this.connection.prepare(`UPDATE previewFlow SET name='${update.name}' WHERE preview='${update.destination}' AND album='${update.album}';`);
        stmt.run();
    }

    updateDestination(update) {
        const stmt = this.connection.prepare(`UPDATE previewFlow SET preview='${update.dest}' WHERE name='${update.name}' AND album='${update.album}';`);
        stmt.run();
    }

    insertRow(args) {
        const stmt = this.connection.prepare("INSERT INTO previewFlow VALUES (@collection, @name, @album, @base, @preview);");
        stmt.run(args);
    }

    updateRow(args) {
        const stmt = this.connection.prepare("UPDATE previewFlow set collection=@collection, name=@name, album=@album, base=@base, preview=@preview;");
        stmt.run(args);
    }

    queryAll() {
        const stmt = this.connection.prepare('SELECT DISTINCT * FROM previewFlow;');
        return stmt.get();
    }

    queryAllWhere(album) {
        const stmt = this.connection.prepare(`SELECT DISTINCT * FROM previewFlow WHERE album='${album}';`);
        return stmt.all();
    }

    queryPreviewFlow(album: string) {
        const stmt = this.connection.prepare(`SELECT * FROM previewFlow where album='${album}';`);
        return stmt.all();  
    }
}
