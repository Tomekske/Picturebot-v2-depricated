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
exports.Settings = void 0;
var sqlite_1 = require("./sqlite");
var Settings = /** @class */ (function (_super) {
    __extends(Settings, _super);
    function Settings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Settings.prototype.createTable = function (dbCon) {
        dbCon.exec("CREATE TABLE IF NOT EXISTS Settings(\n            \"uploadEdited\" varchar(200) NOT NULL, \n            \"uploadSocialMedia\" varchar(200) NOT NULL, \n            \"sofwareEditing\" varchar(200) NOT NULL, \n            \"sofwarePostProcessing\" varchar(200) NOT NULL, \n            \"fileType\" varchar(200) NOT NULL, \n            \"logLevel\" varchar(200) NOT NULL, \n            \"conversion\" varchar(3) NOT NULL);");
    };
    Settings.prototype.tableExists = function (dbCon) {
        var count = dbCon.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Settings'").pluck().get();
        ;
        return ((count == 1) ? true : false);
    };
    Settings.prototype.insertRow = function (dbCon, args) {
        var stmt = dbCon.prepare("INSERT INTO Settings VALUES (@uploadEdited, @uploadSocialMedia, @sofwareEditing, @sofwarePostProcessing, @fileType, @logLevel, @conversion);");
        stmt.run(args);
    };
    Settings.prototype.updateRow = function (dbCon, args) {
        var stmt = dbCon.prepare("UPDATE Settings set uploadEdited=@uploadEdited, uploadSocialMedia=@uploadSocialMedia, sofwareEditing = @sofwareEditing, sofwarePostProcessing=@sofwarePostProcessing, fileType=@fileType, logLevel=@logLevel, conversion=@conversion;");
        stmt.run(args);
    };
    Settings.prototype.queryAll = function (dbCon) {
        var stmt = dbCon.prepare('SELECT * FROM Settings');
        return stmt.get();
    };
    return Settings;
}(sqlite_1.Sqlite));
exports.Settings = Settings;
//# sourceMappingURL=settings.js.map