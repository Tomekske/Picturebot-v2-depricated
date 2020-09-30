"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Library = void 0;
var sqlite_1 = require("./sqlite");
var Library = /** @class */ (function (_super) {
    __extends(Library, _super);
    function Library() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Library.prototype.createTable = function (dbCon) {
        dbCon.exec("CREATE TABLE IF NOT EXISTS Library(\n            \"name\" varchar(200) NOT NULL, \n            \"base\" varchar(200) NOT NULL, \n            \"path\" varchar(400) NOT NULL PRIMARY KEY)");
    };
    Library.prototype.tableExists = function (dbCon) {
        var count = dbCon.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Library'").pluck().get();
        ;
        return ((count == 1) ? true : false);
    };
    Library.prototype.insertRow = function (dbCon, args) {
        var stmt = dbCon.prepare("INSERT INTO Library VALUES (@name, @base, @path);");
        stmt.run(args);
    };
    Library.prototype.updateRow = function (dbCon, args) {
        var stmt = dbCon.prepare("UPDATE Library set name=@name, base=@base, path=@path;");
        stmt.run(args);
    };
    Library.prototype.queryAll = function (dbCon) {
        var stmt = dbCon.prepare('SELECT DISTINCT * FROM Library;');
        return stmt.get();
    };
    Library.prototype.queryLibraries = function (dbCon) {
        var stmt = dbCon.prepare('SELECT DISTINCT path FROM Library DESC;');
        return stmt.all();
    };
    return Library;
}(sqlite_1.Sqlite));
exports.Library = Library;
//# sourceMappingURL=library.js.map