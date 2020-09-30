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
exports.BaseFlow = void 0;
var sqlite_1 = require("./sqlite");
var BaseFlow = /** @class */ (function (_super) {
    __extends(BaseFlow, _super);
    function BaseFlow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseFlow.prototype.createTable = function (dbCon) {
        dbCon.exec("CREATE TABLE IF NOT EXISTS baseFlow(\n            \"name\" varchar(200) NOT NULL,\n            \"selection\" INTEGER NULL,\n            \"source\" varchar(400) NOT NULL,\n            \"destination\" varchar(400) NOT NULL PRIMARY KEY)");
    };
    BaseFlow.prototype.tableExists = function (dbCon) {
        var count = dbCon.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='baseFlow'").pluck().get();
        ;
        return ((count == 1) ? true : false);
    };
    BaseFlow.prototype.insertRow = function (dbCon, args) {
        var stmt = dbCon.prepare("INSERT INTO baseFlow VALUES (@name, @selection, @source, @destination);");
        stmt.run(args);
    };
    BaseFlow.prototype.updateRow = function (dbCon, args) {
        var stmt = dbCon.prepare("UPDATE baseFlow set name=@name, selection=@selection, source=@source, destination=@destination;");
        stmt.run(args);
    };
    BaseFlow.prototype.queryAll = function (dbCon) {
        var stmt = dbCon.prepare('SELECT DISTINCT * FROM baseFlow;');
        return stmt.get();
    };
    return BaseFlow;
}(sqlite_1.Sqlite));
exports.BaseFlow = BaseFlow;
//# sourceMappingURL=baseFlow.js.map