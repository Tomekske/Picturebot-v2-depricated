"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.Log = function () {
        var log4js = require('log4js');
        log4js.configure({
            "appenders": {
                "console": {
                    "type": "console",
                    "category": "console"
                },
                "file": {
                    "type": "fileSync",
                    "filename": "C:\\Users\\joost\\Documents\\Log\\app.log",
                    "maxLogSize": 16384,
                    "numBackups": 3,
                    "pattern": "%d{dd-MM-yyyy HH:mm:ss} %-5p [%m]",
                    "category": "file"
                }
            },
            "categories": {
                "default": { "appenders": ["console", "file"], "level": "DEBUG" },
                "file": { "appenders": ["file"], "level": "DEBUG" }
            }
        });
        var log = log4js.getLogger("file");
        return log;
    };
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map