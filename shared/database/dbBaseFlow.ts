import * as sqlite from 'better-sqlite3';
import { Logger } from '../../logger';
import { Sqlite } from './sqlite';

export class DbBaseFlow extends Sqlite {
    constructor() {
        super();
        
        if(!this.tableExists()) {
            this.createTable();
        }
    }

    createTable() {
        this.connection.exec(`CREATE TABLE IF NOT EXISTS baseFlow(
            "collection" varchar(400) NOT NULL,
            "name" varchar(200) NOT NULL,
            "album" varchar(200) NOT NULL,
            "selection" INTEGER NULL,
            "source" varchar(400) NOT NULL,
            "destination" varchar(400) NOT NULL PRIMARY KEY)`
        );
    }

    tableExists() {
        const count = this.connection.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='baseFlow'").pluck().get();;
        return ((count == 1) ? true : false);
    }

    insertRow(args) {
        const stmt = this.connection.prepare("INSERT INTO baseFlow VALUES (@collection, @name, @album, @selection, @source, @destination);");
        stmt.run(args);
    }

    updateRow(args) {
        const stmt = this.connection.prepare("UPDATE baseFlow set collection=@collection, name=@name, album=@album, selection=@selection, source=@source, destination=@destination;");
        stmt.run(args);
    }

    updateName(update) {
        const stmt = this.connection.prepare(`UPDATE baseFlow SET name='${update.name}' WHERE destination='${update.destination}' AND album='${update.album}';`);
        stmt.run();
    }

    updateDestination(update) {
        const stmt = this.connection.prepare(`UPDATE baseFlow SET destination='${update.dest}' WHERE name='${update.name}' AND album='${update.album}';`);
        stmt.run();
    }

    queryAll() {
        const stmt = this.connection.prepare('SELECT DISTINCT * FROM baseFlow;');
        return stmt.get();
    }

    queryBaseFlow(album: string) {
        const stmt = this.connection.prepare(`SELECT * FROM baseFlow where album='${album}';`);
        return stmt.all();  
    }
}
