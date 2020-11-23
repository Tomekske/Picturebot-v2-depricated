import { Logger } from '../logger/logger';
import { Sqlite } from './sqlite';

export class DbFavoriteFlow extends Sqlite {

    /**
     * DbFavoriteFlow constructor
     */
    constructor() {
        super();
    }

    /**
     * Method to create the favoriteFlow table
     */
    createTable() {
        let query: string = `CREATE TABLE IF NOT EXISTS favoriteFlow(
            "collection" varchar(400) NOT NULL,
            "album" varchar(200) NOT NULL,
            "preview" varchar(400),
            "base" varchar(400) NOT NULL PRIMARY KEY)`;

        Logger.Log().debug(`Query: ${query}`);
        this.connection.exec(query);
    }

    /**
     * Method to check whether the favoriteFlow table exists
     */
    tableExists() {
        let query: string = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='favoriteFlow'";
        const count = this.connection.prepare(query).pluck().get();

        Logger.Log().debug(`Query: ${query}`);
        return ((count == 1) ? true : false);
    }

    /**
     * Method to insert data into table's row
     * @param args Data needed to insert into the table's row
     */
    insertRow(args) {
        const stmt = this.connection.prepare("INSERT INTO favoriteFlow VALUES (@collection, @album, @preview, @base);");
        
        Logger.Log().debug(`Query: INSERT INTO favoriteFlow VALUES ("${JSON.stringify(args)}")`);
        stmt.run(args);
    }

    /**
     * Method to query all values from the favoriteFlow table
     */
    queryAll() {
        let query: string = 'SELECT DISTINCT * FROM favoriteFlow;';
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.get();
    }

    /**
     * Delete pictures relations located in a specified album from the database
     * @param album Album where the pictures are located in
     */
    deletePicturesWhereAlbum(album: string) {
        let query: string = `Delete FROM favoriteFlow WHERE album='${album}'`;
        const stmt = this.connection.prepare(query);
        
        Logger.Log().debug(`Query: ${query}`);
        stmt.run();
    }

    /**
     * Delete a favorited picture from the favorite flow
     * @param base Selected base location
     */
    deletePictureWhereBase(base: string) {
        let query: string = `Delete FROM favoriteFlow WHERE base='${base}'`;
        const stmt = this.connection.prepare(query);
        
        Logger.Log().debug(`Query: ${query}`);
        stmt.run();
    }

    /**
     * Delete a picture relation from the database
     * @param path Path to the picture
     */
    deletePicture(path: string) {
        let query: string = `Delete FROM favoriteFlow WHERE preview='${path}'`;
        const stmt = this.connection.prepare(query);
        
        Logger.Log().debug(`Query: ${query}`);
        stmt.run();
    }

    /**
     * Method to query all records from a certain album
     * @param album Selected album
     */
    queryAllWhereAlbum(album) {
        let query: string = `SELECT DISTINCT * FROM favoriteFlow WHERE album='${album}';`;
        const stmt = this.connection.prepare(query);

        Logger.Log().debug(`Query: ${query}`);
        return stmt.all();
    }
}
