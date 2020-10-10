import Database = require("better-sqlite3");
import { Logger } from '../../logger';
import { Sqlite } from './sqlite';

export class DbSettings extends Sqlite {
    constructor() {
        super();
        
        if(!this.tableExists()) {
            this.createTable();
        }
    }
    
    createTable() {
        this.connection.exec(`CREATE TABLE IF NOT EXISTS Settings(
            "uploadEdited" varchar(200) NOT NULL, 
            "uploadSocialMedia" varchar(200) NOT NULL, 
            "sofwareEditing" varchar(200) NOT NULL, 
            "sofwarePostProcessing" varchar(200) NOT NULL, 
            "fileType" varchar(200) NOT NULL, 
            "logLevel" varchar(200) NOT NULL, 
            "conversion" varchar(3) NOT NULL);`
        );
    }

    tableExists() {
        const count = this.connection.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Settings'").pluck().get();;
        return ((count == 1) ? true : false);
    }

    insertRow(args) {
        const stmt = this.connection.prepare("INSERT INTO Settings VALUES (@uploadEdited, @uploadSocialMedia, @sofwareEditing, @sofwarePostProcessing, @fileType, @logLevel, @conversion);");
        stmt.run(args);
    }

    updateRow(args) {
        const stmt = this.connection.prepare("UPDATE Settings set uploadEdited=@uploadEdited, uploadSocialMedia=@uploadSocialMedia, sofwareEditing = @sofwareEditing, sofwarePostProcessing=@sofwarePostProcessing, fileType=@fileType, logLevel=@logLevel, conversion=@conversion;");
        stmt.run(args);
    }

    queryAll() {
        const stmt = this.connection.prepare('SELECT * FROM Settings');
        return stmt.get();
    }

    isEmpty() {
        const count = this.connection.prepare("SELECT count(1) FROM Settings;").pluck().get();
        return ((count == 0) ? true : false);
    }

    queryConversion() {
        const stmt = this.connection.prepare('SELECT conversion FROM Settings');
        return stmt.pluck().get();
    }
}
