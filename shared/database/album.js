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
exports.Album = void 0;
var sqlite_1 = require("./sqlite");
var Album = /** @class */ (function (_super) {
    __extends(Album, _super);
    function Album() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Album.prototype.createTable = function (dbCon) {
        dbCon.exec("CREATE TABLE IF NOT EXISTS Album(\n            \"collection\" varchar(250) NOT NULL,\n            \"name\" varchar(50) NOT NULL,\n            \"date\" date NOT NULL,\n            \"path\" varchar(250) NOT NULL PRIMARY KEY)");
    };
    Album.prototype.tableExists = function (dbCon) {
        var count = dbCon.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Album'").pluck().get();
        ;
        return ((count == 1) ? true : false);
    };
    Album.prototype.insertRow = function (dbCon, args) {
        var stmt = dbCon.prepare("INSERT INTO Album VALUES (\n            @collection, @name, @date, @path);");
        stmt.run(args);
    };
    Album.prototype.updateRow = function (dbCon, args) {
        var stmt = dbCon.prepare("UPDATE Album set \n            collection=@collection, name=@name, date=@date, path=@path;");
        stmt.run(args);
    };
    Album.prototype.queryAll = function (dbCon) {
        var stmt = dbCon.prepare('SELECT DISTINCT * FROM Album;');
        return stmt.get();
    };
    return Album;
}(sqlite_1.Sqlite));
exports.Album = Album;
//# sourceMappingURL=album.js.map