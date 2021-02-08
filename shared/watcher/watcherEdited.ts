import { Watcher } from "./watcher";
import { Api } from '../database/api';
import * as path from 'path';
import { IEdited, IFlow, IPreview } from "../database/interfaces";
import { Logger } from "../logger/logger";

export class WatcherEdited extends Watcher {
    /**
     * Returns a watcher listener callback
     */
    listener() {
        let _this = this;

        return function (changeType, fullPath, currentStat, previousStat) {
            let flows: IFlow = Api.getFlows(_this.album);
            let picture: IPreview = Api.getPreviewPictureWhereName(fullPath);

            const pathEdited = path.join(_this.album.album, flows.edited, path.basename(fullPath));
            let pictureEdited: IEdited = { collection: _this.album.collection, album: _this.album.album, preview: picture.preview, base: picture.base, edited: pathEdited };

            switch (changeType) {
                case 'create': Api.AddEditedPicture(pictureEdited); break;
                case 'update': break;
                case 'delete': Api.deleteEditedPicture(pictureEdited); break;
                default: Logger.Log().debug(`Watcher: unhandled type detected: ${changeType}`);
            }
        }
    }
}
