import { Helper } from '../helper/helper';
import { App } from '../helper/enums';
import * as path from 'path';

/**
 * Static class logger
 */
export class Logger {
  static Log(): any {
      var log4js = require('log4js');
      log4js.configure({
          "appenders": {
              "console": {
                  "type": "console",
                  "category": "console"
              },
              "file": {
                  "type": "fileSync",
                  "filename": path.join(Helper.pathMyDocuments(), App.name, "app.log"),
                  "maxLogSize": 16384,
                  "numBackups": 3,
                  "pattern": "%d{dd-MM-yyyy HH:mm:ss} %-5p [%m]",
                  "category": "file"
                }
          },
          "categories": {
            "default": { "appenders": [ "console", "file" ], "level": "ERROR" },
            "file": { "appenders": [ "file"], "level": "ERROR" }
          }
        });
      
      let log = log4js.getLogger("file");
      return log;
  }
}
