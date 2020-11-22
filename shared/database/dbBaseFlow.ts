import { Logger } from '../logger/logger';
import { Sqlite } from './sqlite';

export class DbBaseFlow extends Sqlite {

    /**
     * DbBaseFlow constructor
     */
    constructor() {
        super();
    }

    /**
     * Method to create the baseFlow table
     */
    createTable() {
        let query: string = `CREATE TABLE IF NOT EXISTS baseFlow(
            "collection" varchar(400) NOT NULL,
            "name" varchar(200) NOT NULL,
            "album" varchar(200) NOT NULL,
            "favorited" INTEGER NULL,
            "backup" varchar(400) NOT NULL,
            "preview" varchar(400),
            "base" varchar(400) NOT NULL PRIMARY KEY,
            "date" varchar(10) NOT NULL,
            "time" varchar(8) NOT NULL)`;

        Logger.Log().debug(`Query: ${query}`);
        this.connection.exec(query);
    }

    /**
     * Method to check whether the baseFlow table exists
     */
    tableExists() {
        let query: string = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='baseFlow'";
        const count = this.connection.prepare(query).pluck().get();

        Logger.Log().debug(`Query: ${query}`);
        return ((count == 1) ? true : false);
    }

    /**
     * Method to insert data into table's row
     * @param args Data needed to insert into the table's row
     */
    insertRow(args) {
        const stmt = this.connection.prepare("INSERT INTO baseFlow VALUES (@collection, @name, @album, @favorited, @backup, @preview, @base, @date, @time);");
        
        Logger.Log().debug(`Query: INSERT INTO baseFlow VALUES ("${JSON.stringify(args)}")`);
        stmt.run(args);
    }

    /**
     * Method to update the album name of a specified album
     * @param update updated values
     */
    updateName(update) {
        let query: string = `UPDATE baseFlow SET name='${update.name}' WHERE base='${update.base}' AND album='${update.album}';`;
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        stmt.run();
    }

    /**
     * Method to update the destination location
     * @param update updated values
     */
    updateBase(update) {
        let query: string = `UPDATE baseFlow SET base='${update.updatedBase}' WHERE name='${update.name}' AND album='${update.album}';`;
        const stmt = this.connection.prepare(query);
        
        Logger.Log().debug(`Query: ${query}`);
        stmt.run();
    }

    /**
     * Method to update the destination location
     * @param update updated values
     */
    updatePreview(update) {
        let query: string = `UPDATE baseFlow SET preview='${update.preview}' WHERE name='${update.name}' AND album='${update.album}';`;
        const stmt = this.connection.prepare(query);
        
        Logger.Log().debug(`Query: ${query}`);
        stmt.run();
    }

    /**
     * Method to query all values from the baseFlow table
     */
    queryAll() {
        let query: string = 'SELECT DISTINCT * FROM baseFlow;';
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.get();
    }

    /**
     * Method to query all records from the baseFlow table
     * @param album Select the album where all the records will get queried
     */
    queryBaseFlow(album: string) {
        let query: string = `SELECT * FROM baseFlow where album='${album}';`;
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.all();  
    }

    /**
     * Delete a picture relation from the database
     * @param path Path to the picture
     */
    deletePicture(path: string) {
        let query: string = `Delete FROM baseFlow WHERE destination='${path}'`;
        const stmt = this.connection.prepare(query);
        
        Logger.Log().debug(`Query: ${query}`);
        stmt.run();
    }

    /**
     * Delete pictures relations located in a specified album from the database
     * @param album Album where the pictures are located in
     */
    deletePicturesWhereAlbum(album: string) {
        let query: string = `Delete FROM baseFlow WHERE album='${album}'`;
        const stmt = this.connection.prepare(query);
        
        Logger.Log().debug(`Query: ${query}`);
        stmt.run();
    }

    /**
     * Update album's name within the album, base and backup record
     * @param value Current album name
     * @param updated Updated album name
     */
    updateAlbum(value: string, updated: string) {
        let query: string = `UPDATE baseFlow SET album=REPLACE(album,'${value}','${updated}'), preview=REPLACE(preview,'${value}','${updated}'), base=REPLACE(base,'${value}','${updated}'), backup=REPLACE(backup,'${value}','${updated}');`;
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        stmt.run();
    }

    /**
     * Get the is favorited boolean of a specified picture
     * @param preview Selected preview
     */
    getIsFavoriteWherePreview(preview: string) {
        let query: string = `SELECT favorited FROM baseFlow WHERE preview='${preview}';`;
        const count = this.connection.prepare(query).pluck().get();
        Logger.Log().debug(`Query: ${query}`);
        return ((count == 1) ? true : false);
    }

    /**
     * Update the favorited boolean of a specified picture
     * @param preview Selected preview
     * @param isFavorited Specified value
     */
    updateFavorited(preview: string, isFavorited: number) {
        let query: string = `UPDATE baseFlow SET favorited='${isFavorited}' WHERE preview='${preview}';`;
        const stmt = this.connection.prepare(query);
        
        Logger.Log().debug(`Query: ${query}`);
        stmt.run();
    }
}