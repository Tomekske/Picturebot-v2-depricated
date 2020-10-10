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
exports.DbAlbum = void 0;
var sqlite_1 = require("./sqlite");
var DbAlbum = /** @class */ (function (_super) {
    __extends(DbAlbum, _super);
    function DbAlbum() {
        var _this = _super.call(this) || this;
        if (!_this.tableExists()) {
            _this.createTable();
        }
        return _this;
    }
    DbAlbum.prototype.createTable = function () {
        this.connection.exec("CREATE TABLE IF NOT EXISTS Album(\n            \"collection\" varchar(250) NOT NULL,\n            \"name\" varchar(50) NOT NULL,\n            \"date\" date NOT NULL,\n            \"album\" varchar(250) NOT NULL PRIMARY KEY)");
    };
    DbAlbum.prototype.tableExists = function () {
        var count = this.connection.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Album'").pluck().get();
        ;
        return ((count == 1) ? true : false);
    };
    DbAlbum.prototype.insertRow = function (args) {
        var stmt = this.connection.prepare("INSERT INTO Album VALUES (\n            @collection, @name, @date, @album);");
        stmt.run(args);
    };
    DbAlbum.prototype.updateRow = function (args) {
        var stmt = this.connection.prepare("UPDATE Album set \n            collection=@collection, name=@name, date=@date, album=@album;");
        stmt.run(args);
    };
    DbAlbum.prototype.queryAll = function () {
        var stmt = this.connection.prepare('SELECT DISTINCT * FROM Album;');
        return stmt.get();
    };
    DbAlbum.prototype.queryAlbums = function (collection) {
        var stmt = this.connection.prepare("SELECT album FROM Album WHERE collection='" + collection + "';");
        return stmt.all();
    };
    return DbAlbum;
}(sqlite_1.Sqlite));
exports.DbAlbum = DbAlbum;
//# sourceMappingURL=dbAlbum.js.map