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
exports.DbBackupFlow = void 0;
var sqlite_1 = require("./sqlite");
var DbBackupFlow = /** @class */ (function (_super) {
    __extends(DbBackupFlow, _super);
    function DbBackupFlow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DbBackupFlow.prototype.createTable = function () {
        this.connection.exec("CREATE TABLE IF NOT EXISTS backupFlow(\n            \"collection\" varchar(400) NOT NULL,\n            \"name\" varchar(200) NOT NULL,\n            \"album\" varchar(200) NOT NULL,\n            \"source\" varchar(400) NOT NULL,\n            \"destination\" varchar(400) NOT NULL PRIMARY KEY)");
    };
    DbBackupFlow.prototype.tableExists = function () {
        var count = this.connection.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='backupFlow'").pluck().get();
        ;
        return ((count == 1) ? true : false);
    };
    DbBackupFlow.prototype.insertRow = function (args) {
        var stmt = this.connection.prepare("INSERT INTO backupFlow VALUES (@collection, @name, @album, @source, @destination);");
        stmt.run(args);
    };
    DbBackupFlow.prototype.updateRow = function (args) {
        var stmt = this.connection.prepare("UPDATE backupFlow set collection=@collection, name=@name, album=@album, source=@source, destination=@destination;");
        stmt.run(args);
    };
    DbBackupFlow.prototype.queryAll = function () {
        var stmt = this.connection.prepare('SELECT DISTINCT * FROM backupFlow;');
        return stmt.get();
    };
    return DbBackupFlow;
}(sqlite_1.Sqlite));
exports.DbBackupFlow = DbBackupFlow;
//# sourceMappingURL=dbBackupFlow.js.map