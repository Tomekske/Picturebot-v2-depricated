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
exports.Collection = void 0;
var sqlite_1 = require("./sqlite");
var Collection = /** @class */ (function (_super) {
    __extends(Collection, _super);
    function Collection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Collection.prototype.createTable = function (dbCon) {
        dbCon.exec("CREATE TABLE IF NOT EXISTS Collection(\n            \"library\" varchar(200) NOT NULL, \n            \"name\" varchar(50) NOT NULL, \n            \"backup\" varchar(40), \n            \"base\" varchar(40) NOT NULL, \n            \"preview\" varchar(40) NOT NULL, \n            \"files\" varchar(40) NOT NULL, \n            \"edited\" varchar(40) NOT NULL, \n            \"socialMedia\" varchar(40) NOT NULL,\n            \"selection\" varchar(40) NOT NULL,\n            \"path\" varchar(250) NOT NULL PRIMARY KEY)");
    };
    Collection.prototype.tableExists = function (dbCon) {
        var count = dbCon.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Collection'").pluck().get();
        ;
        return ((count == 1) ? true : false);
    };
    Collection.prototype.insertRow = function (dbCon, args) {
        var stmt = dbCon.prepare("INSERT INTO Collection VALUES (\n            @library, @name, @backup, @base, @preview, @files, @edited, @socialMedia, @selection, @path);");
        stmt.run(args);
    };
    Collection.prototype.updateRow = function (dbCon, args) {
        var stmt = dbCon.prepare("UPDATE Collection set \n            library=@library, name=@name, base=@base, preview=@preview, files=@files, edited=@edited, socialMedia=@socialMedia, selection=@selection, base=@base, path=@path;");
        stmt.run(args);
    };
    Collection.prototype.queryAll = function (dbCon) {
        var stmt = dbCon.prepare('SELECT DISTINCT * FROM Collection;');
        return stmt.get();
    };
    Collection.prototype.queryCollections = function (dbCon) {
        var stmt = dbCon.prepare('SELECT DISTINCT path FROM Collection DESC;');
        return stmt.all();
    };
    Collection.prototype.queryFlows = function (dbCon, path) {
        var q = "SELECT backup, base, preview, files, edited, socialMedia, selection FROM Collection WHERE path='" + path + "';";
        console.log("QUERY === " + q);
        var stmt = dbCon.prepare("SELECT backup, base, preview, files, edited, socialMedia, selection FROM Collection WHERE path='" + path + "';");
        return stmt.get();
    };
    return Collection;
}(sqlite_1.Sqlite));
exports.Collection = Collection;
//# sourceMappingURL=collection.js.map