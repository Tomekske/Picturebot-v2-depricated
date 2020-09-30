import Database = require("better-sqlite3");
import { Logger } from '../../logger';
import { Sqlite } from './sqlite';

export class Settings extends Sqlite {
    createTable(dbCon) {
        dbCon.exec(`CREATE TABLE IF NOT EXISTS Settings(
            "uploadEdited" varchar(200) NOT NULL, 
            "uploadSocialMedia" varchar(200) NOT NULL, 
            "sofwareEditing" varchar(200) NOT NULL, 
            "sofwarePostProcessing" varchar(200) NOT NULL, 
            "fileType" varchar(200) NOT NULL, 
            "logLevel" varchar(200) NOT NULL, 
            "conversion" varchar(3) NOT NULL);`
        );
    }

    tableExists(dbCon) {
        const count = dbCon.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Settings'").pluck().get();;
        return ((count == 1) ? true : false);
    }

    insertRow(dbCon, args) {
        const stmt = dbCon.prepare("INSERT INTO Settings VALUES (@uploadEdited, @uploadSocialMedia, @sofwareEditing, @sofwarePostProcessing, @fileType, @logLevel, @conversion);");
        stmt.run(args);
    }

    updateRow(dbCon, args) {
        const stmt = dbCon.prepare("UPDATE Settings set uploadEdited=@uploadEdited, uploadSocialMedia=@uploadSocialMedia, sofwareEditing = @sofwareEditing, sofwarePostProcessing=@sofwarePostProcessing, fileType=@fileType, logLevel=@logLevel, conversion=@conversion;");
        stmt.run(args);
    }

    queryAll(dbCon) {
        const stmt = dbCon.prepare('SELECT * FROM Settings');
        return stmt.get();
    }
}
