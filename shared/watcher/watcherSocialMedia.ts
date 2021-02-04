import { Watcher } from "./watcher";
import { Api } from '../database/api';
import * as path from 'path';
import { IFlow, IPreview, ISocialMedia } from "../database/interfaces";
import { Logger } from "../logger/logger";

export class WatcherSocialMedia extends Watcher {
    /**
     * Returns a watcher listener callback
     */
    listener() {
        let _this = this;

        return function(changeType, fullPath, currentStat, previousStat) {
            let flows: IFlow = Api.getFlows(_this.album);
            let picture: IPreview = Api.getPreviewPictureWhereName(fullPath);

            let pathSocialMedia = path.join(_this.album.album, flows.socialMedia, path.basename(fullPath));
            let pictureSocialMedia: ISocialMedia = { collection: _this.album.collection, album: _this.album.album, preview: picture.preview, base: picture.base, socialMedia: pathSocialMedia };

            switch (changeType) {
                case 'create': Api.AddSocialMediaPicture(pictureSocialMedia); break;
                case 'update': break;
                case 'delete': Api.deleteSocialMediaPicture(pictureSocialMedia); break;
                default: Logger.Log().debug(`Watcher: unhandled type detected: ${changeType}`);
            } 
        }
    }
}
