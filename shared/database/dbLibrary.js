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
exports.DbLibrary = void 0;
var sqlite_1 = require("./sqlite");
var DbLibrary = /** @class */ (function (_super) {
    __extends(DbLibrary, _super);
    function DbLibrary() {
        var _this = _super.call(this) || this;
        if (!_this.tableExists()) {
            _this.createTable();
        }
        return _this;
    }
    DbLibrary.prototype.createTable = function () {
        this.connection.exec("CREATE TABLE IF NOT EXISTS Library(\n            \"name\" varchar(200) NOT NULL, \n            \"base\" varchar(200) NOT NULL, \n            \"library\" varchar(400) NOT NULL PRIMARY KEY)");
    };
    DbLibrary.prototype.tableExists = function () {
        var count = this.connection.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Library'").pluck().get();
        ;
        return ((count == 1) ? true : false);
    };
    DbLibrary.prototype.insertRow = function (args) {
        var stmt = this.connection.prepare("INSERT INTO Library VALUES (@name, @base, @library);");
        stmt.run(args);
    };
    DbLibrary.prototype.updateRow = function (args) {
        var stmt = this.connection.prepare("UPDATE Library set name=@name, base=@base, library=@library;");
        stmt.run(args);
    };
    DbLibrary.prototype.queryAll = function () {
        var stmt = this.connection.prepare('SELECT DISTINCT * FROM Library;');
        return stmt.get();
    };
    DbLibrary.prototype.queryLibraries = function () {
        var stmt = this.connection.prepare('SELECT DISTINCT library FROM Library DESC;');
        return stmt.all();
    };
    return DbLibrary;
}(sqlite_1.Sqlite));
exports.DbLibrary = DbLibrary;
//# sourceMappingURL=dbLibrary.js.map