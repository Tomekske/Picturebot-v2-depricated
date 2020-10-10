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
exports.DbPreviewFlow = void 0;
var sqlite_1 = require("./sqlite");
var DbPreviewFlow = /** @class */ (function (_super) {
    __extends(DbPreviewFlow, _super);
    function DbPreviewFlow() {
        var _this = _super.call(this) || this;
        if (!_this.tableExists()) {
            _this.createTable();
        }
        return _this;
    }
    DbPreviewFlow.prototype.createTable = function () {
        this.connection.exec("CREATE TABLE IF NOT EXISTS previewFlow(\n            \"collection\" varchar(400) NOT NULL,,\n            \"album\" varchar(200) NOT NULL\n            \"source\" varchar(400) NOT NULL,\n            \"destination\" varchar(400) NOT NULL PRIMARY KEY)");
    };
    DbPreviewFlow.prototype.tableExists = function () {
        var count = this.connection.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='previewFlow'").pluck().get();
        ;
        return ((count == 1) ? true : false);
    };
    DbPreviewFlow.prototype.insertRow = function (args) {
        var stmt = this.connection.prepare("INSERT INTO previewFlow VALUES (@collection, @album, @source, @destination);");
        stmt.run(args);
    };
    DbPreviewFlow.prototype.updateRow = function (args) {
        var stmt = this.connection.prepare("UPDATE previewFlow set collection=@collection, album=@album, source=@source, destination=@destination;");
        stmt.run(args);
    };
    DbPreviewFlow.prototype.queryAll = function () {
        var stmt = this.connection.prepare('SELECT DISTINCT * FROM previewFlow;');
        return stmt.get();
    };
    return DbPreviewFlow;
}(sqlite_1.Sqlite));
exports.DbPreviewFlow = DbPreviewFlow;
//# sourceMappingURL=dbPreviewFlow.js.map