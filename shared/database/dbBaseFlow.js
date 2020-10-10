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
exports.DbBaseFlow = void 0;
var sqlite_1 = require("./sqlite");
var DbBaseFlow = /** @class */ (function (_super) {
    __extends(DbBaseFlow, _super);
    function DbBaseFlow() {
        var _this = _super.call(this) || this;
        if (!_this.tableExists()) {
            _this.createTable();
        }
        return _this;
    }
    DbBaseFlow.prototype.createTable = function () {
        this.connection.exec("CREATE TABLE IF NOT EXISTS baseFlow(\n            \"collection\" varchar(400) NOT NULL,\n            \"name\" varchar(200) NOT NULL,\n            \"album\" varchar(200) NOT NULL,\n            \"selection\" INTEGER NULL,\n            \"source\" varchar(400) NOT NULL,\n            \"destination\" varchar(400) NOT NULL PRIMARY KEY)");
    };
    DbBaseFlow.prototype.tableExists = function () {
        var count = this.connection.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='baseFlow'").pluck().get();
        ;
        return ((count == 1) ? true : false);
    };
    DbBaseFlow.prototype.insertRow = function (args) {
        var stmt = this.connection.prepare("INSERT INTO baseFlow VALUES (@collection, @name, @album, @selection, @source, @destination);");
        stmt.run(args);
    };
    DbBaseFlow.prototype.updateRow = function (args) {
        var stmt = this.connection.prepare("UPDATE baseFlow set collection=@collection, name=@name, album=@album, selection=@selection, source=@source, destination=@destination;");
        stmt.run(args);
    };
    DbBaseFlow.prototype.queryAll = function () {
        var stmt = this.connection.prepare('SELECT DISTINCT * FROM baseFlow;');
        return stmt.get();
    };
    return DbBaseFlow;
}(sqlite_1.Sqlite));
exports.DbBaseFlow = DbBaseFlow;
//# sourceMappingURL=dbBaseFlow.js.map