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
exports.DbCollection = void 0;
var sqlite_1 = require("./sqlite");
var DbCollection = /** @class */ (function (_super) {
    __extends(DbCollection, _super);
    function DbCollection() {
        var _this = _super.call(this) || this;
        if (!_this.tableExists()) {
            _this.createTable();
        }
        return _this;
    }
    DbCollection.prototype.createTable = function () {
        this.connection.exec("CREATE TABLE IF NOT EXISTS Collection(\n            \"library\" varchar(200) NOT NULL, \n            \"name\" varchar(50) NOT NULL, \n            \"backup\" varchar(40), \n            \"base\" varchar(40) NOT NULL, \n            \"preview\" varchar(40) NOT NULL, \n            \"files\" varchar(40) NOT NULL, \n            \"edited\" varchar(40) NOT NULL, \n            \"socialMedia\" varchar(40) NOT NULL,\n            \"selection\" varchar(40) NOT NULL,\n            \"collection\" varchar(250) NOT NULL PRIMARY KEY)");
    };
    DbCollection.prototype.tableExists = function () {
        var count = this.connection.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Collection'").pluck().get();
        ;
        return ((count == 1) ? true : false);
    };
    DbCollection.prototype.insertRow = function (args) {
        var stmt = this.connection.prepare("INSERT INTO Collection VALUES (\n            @library, @name, @backup, @base, @preview, @files, @edited, @socialMedia, @selection, @collection);");
        stmt.run(args);
    };
    DbCollection.prototype.updateRow = function (args) {
        var stmt = this.connection.prepare("UPDATE Collection set \n            library=@library, name=@name, base=@base, preview=@preview, files=@files, edited=@edited, socialMedia=@socialMedia, selection=@selection, base=@base, collection=@collection;");
        stmt.run(args);
    };
    DbCollection.prototype.queryAll = function () {
        var stmt = this.connection.prepare('SELECT DISTINCT * FROM Collection;');
        return stmt.all();
    };
    DbCollection.prototype.queryCollections = function () {
        var stmt = this.connection.prepare('SELECT DISTINCT collection FROM Collection DESC;');
        return stmt.all();
    };
    DbCollection.prototype.queryFlows = function (collection) {
        var q = "SELECT backup, base, preview, files, edited, socialMedia, selection FROM Collection WHERE collection='" + collection + "';";
        console.log("QUERY === " + q);
        var stmt = this.connection.prepare("SELECT backup, base, preview, files, edited, socialMedia, selection FROM Collection WHERE collection='" + collection + "';");
        return stmt.get();
    };
    return DbCollection;
}(sqlite_1.Sqlite));
exports.DbCollection = DbCollection;
//# sourceMappingURL=dbCollection.js.map