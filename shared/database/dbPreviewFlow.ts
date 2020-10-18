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
            "album" varchar(200) NOT NULL,
            "source" varchar(400) NOT NULL,
            "destination" varchar(400) NOT NULL PRIMARY KEY)`
        );
    }

    tableExists() {
        const count = this.connection.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='previewFlow'").pluck().get();;
        return ((count == 1) ? true : false);
    }

    insertRow(args) {
        const stmt = this.connection.prepare("INSERT INTO previewFlow VALUES (@collection, @album, @source, @destination);");
        stmt.run(args);
    }

    updateRow(args) {
        const stmt = this.connection.prepare("UPDATE previewFlow set collection=@collection, album=@album, source=@source, destination=@destination;");
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
}
