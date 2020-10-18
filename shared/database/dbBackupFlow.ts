import * as sqlite from 'better-sqlite3';
import { Logger } from '../../logger';
import { Sqlite } from './sqlite';

export class DbBackupFlow extends Sqlite {
    constructor() {
        super();
        
        if(!this.tableExists()) {
            this.createTable();
        }
    }
    
    createTable() {
        this.connection.exec(`CREATE TABLE IF NOT EXISTS backupFlow(
            "collection" varchar(400) NOT NULL,
            "name" varchar(200) NOT NULL,
            "album" varchar(200) NOT NULL,
            "source" varchar(400) NOT NULL,
            "destination" varchar(400) NOT NULL PRIMARY KEY)`
        );
    }

    tableExists() {
        const count = this.connection.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='backupFlow'").pluck().get();
        return ((count == 1) ? true : false);
    }

    insertRow(args) {
        const stmt = this.connection.prepare("INSERT INTO backupFlow VALUES (@collection, @name, @album, @source, @destination);");
        stmt.run(args);
    }

    updateRow(args) {
        const stmt = this.connection.prepare("UPDATE backupFlow set collection=@collection, name=@name, album=@album, source=@source, destination=@destination;");
        stmt.run(args);
    }

    queryAll() {
        const stmt = this.connection.prepare('SELECT DISTINCT * FROM backupFlow;');
        return stmt.get();
    }
}
