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
exports.DbSettings = void 0;
var sqlite_1 = require("./sqlite");
var DbSettings = /** @class */ (function (_super) {
    __extends(DbSettings, _super);
    function DbSettings() {
        var _this = _super.call(this) || this;
        if (!_this.tableExists()) {
            _this.createTable();
        }
        return _this;
    }
    DbSettings.prototype.createTable = function () {
        this.connection.exec("CREATE TABLE IF NOT EXISTS Settings(\n            \"uploadEdited\" varchar(200) NOT NULL, \n            \"uploadSocialMedia\" varchar(200) NOT NULL, \n            \"sofwareEditing\" varchar(200) NOT NULL, \n            \"sofwarePostProcessing\" varchar(200) NOT NULL, \n            \"fileType\" varchar(200) NOT NULL, \n            \"logLevel\" varchar(200) NOT NULL, \n            \"conversion\" varchar(3) NOT NULL);");
    };
    DbSettings.prototype.tableExists = function () {
        var count = this.connection.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Settings'").pluck().get();
        ;
        return ((count == 1) ? true : false);
    };
    DbSettings.prototype.insertRow = function (args) {
        var stmt = this.connection.prepare("INSERT INTO Settings VALUES (@uploadEdited, @uploadSocialMedia, @sofwareEditing, @sofwarePostProcessing, @fileType, @logLevel, @conversion);");
        stmt.run(args);
    };
    DbSettings.prototype.updateRow = function (args) {
        var stmt = this.connection.prepare("UPDATE Settings set uploadEdited=@uploadEdited, uploadSocialMedia=@uploadSocialMedia, sofwareEditing = @sofwareEditing, sofwarePostProcessing=@sofwarePostProcessing, fileType=@fileType, logLevel=@logLevel, conversion=@conversion;");
        stmt.run(args);
    };
    DbSettings.prototype.queryAll = function () {
        var stmt = this.connection.prepare('SELECT * FROM Settings');
        return stmt.get();
    };
    DbSettings.prototype.isEmpty = function () {
        var count = this.connection.prepare("SELECT count(1) FROM Settings;").pluck().get();
        return ((count == 0) ? true : false);
    };
    DbSettings.prototype.queryConversion = function () {
        var stmt = this.connection.prepare('SELECT conversion FROM Settings');
        return stmt.pluck().get();
    };
    return DbSettings;
}(sqlite_1.Sqlite));
exports.DbSettings = DbSettings;
//# sourceMappingURL=dbSettings.js.map