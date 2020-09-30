"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sqlite = void 0;
var Database = require("better-sqlite3");
var logger_1 = require("../../logger");
var Sqlite = /** @class */ (function () {
    function Sqlite() {
        this.path = "C:\\Users\\joost\\Documents\\Log\\food.db";
    }
    Sqlite.prototype.dbConnection = function () {
        logger_1.Logger.Log().debug("Successfully created db");
        return new Database(this.path, { verbose: console.log });
    };
    Sqlite.prototype.dbClose = function (db) {
        db.close();
        logger_1.Logger.Log().debug('Close the database connection.');
    };
    return Sqlite;
}());
exports.Sqlite = Sqlite;
//# sourceMappingURL=sqlite.js.map