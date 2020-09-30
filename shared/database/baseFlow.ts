import * as sqlite from 'better-sqlite3';
import { Logger } from '../../logger';
import { Sqlite } from './sqlite';

export class BaseFlow extends Sqlite {
    createTable(dbCon) {
        dbCon.exec(`CREATE TABLE IF NOT EXISTS baseFlow(
            "name" varchar(200) NOT NULL,
            "selection" INTEGER NULL,
            "source" varchar(400) NOT NULL,
            "destination" varchar(400) NOT NULL PRIMARY KEY)`
        );
    }

    tableExists(dbCon) {
        const count = dbCon.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='baseFlow'").pluck().get();;
        return ((count == 1) ? true : false);
    }

    insertRow(dbCon, args) {
        const stmt = dbCon.prepare("INSERT INTO baseFlow VALUES (@name, @selection, @source, @destination);");
        stmt.run(args);
    }

    updateRow(dbCon, args) {
        const stmt = dbCon.prepare("UPDATE baseFlow set name=@name, selection=@selection, source=@source, destination=@destination;");
        stmt.run(args);
    }

    queryAll(dbCon) {
        const stmt = dbCon.prepare('SELECT DISTINCT * FROM baseFlow;');
        return stmt.get();
    }
}
