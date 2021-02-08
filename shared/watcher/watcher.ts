import { IAlbum } from "../database/interfaces";
import { Logger } from "../logger/logger";
var watchr = require('watchr')

export abstract class Watcher {
    protected flow: string;
    protected album: IAlbum;

    /**
     * Base constructor for derived classes
     */
    constructor(flow: string, album: IAlbum) {
        this.flow = flow;
        this.album = album;
    }

    protected abstract listener(): any;

    /**
     * Create a new stalker that monitors pictures within a flow
     */
    stalker() {
        return watchr.open(this.flow, this.listener(), this.monitor());
    }
    /**
     * Callback which monitors the stalker's status
     */
    private monitor() {
        let _this = this;

        return function (error) {
            if (error) {
                return Logger.Log().error(`Watched failed on '${_this.flow}' - ${error}`);
            }

            Logger.Log().debug(`Watched successful on '${_this.flow}'`);
        }
    }
}
