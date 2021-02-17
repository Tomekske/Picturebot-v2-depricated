import * as path from 'path';
import { Logger } from '../../shared/logger/logger';
import { IAlbum, IBase, IEdited, IFlow, IPreview, ISettings, ISocialMedia } from '../database/interfaces';
import { Helper } from '../helper/helper';
import { DbCollection } from '../database/dbCollection';
import { DbAlbum } from './dbAlbum';
import { DbBaseFlow } from './dbBaseFlow';
import { DbPreviewFlow } from './dbPreviewFlow';
import { DbBackupFlow } from './dbBackupFlow';
import { DbFavoriteFlow } from './dbFavoriteFlow';
import { DbEditedFlow } from './dbEditedFlow';
import { DbSocialMediaFlow } from './dbSocialMediaFlow';
import { DbSettings } from './dbSettings';

/**
 * Static class which integrates an API to easily interact with the database
 */
export class Api {
    /**
     * Create an album on the filesystem containing flows
     * @param album Album that is created
     */
    static createAlbum(album: IAlbum) {
        Helper.createDirectory(album.album);

        if (Helper.isDirectory(album.album)) {
            const albumDb = new DbAlbum();

            albumDb.insertRow(album);
            albumDb.dbClose();

            const collectionDb = new DbCollection();
            let flows: IFlow = collectionDb.queryAllFlows(album.collection);

            // Creating flow directories
            Object.values(flows).forEach(flow => {
                // The selection flow is a virtual directory, so it doesn't need to be created
                if (flow != flows.favorites) {
                    Helper.createDirectory(path.join(album.album, flow));
                }
            });

            collectionDb.dbClose();
        }
    }

    /**
     * Obtain the flows of a certain collection
     * @param album Album object
     */
    static getFlows(album: IAlbum): IFlow {
        let db = new DbCollection();

        let flows: IFlow = db.queryAllFlows(album.collection);
        db.dbClose();

        return flows;
    }

    /**
     * Insert picture with base flow properties into the database
     * @param picture Picture object
     */
    static insertBaseIntoDatabase(picture: IBase) {
        let db = new DbBaseFlow();

        db.insertRow(picture);
        db.dbClose();
    }

    /**
     * Insert picture with preview flow properties into the database
     * @param picture Picture object
     */
    static insertPreviewIntoDatabase(picture: IBase) {
        let db = new DbPreviewFlow();

        db.insertRow(picture);
        db.dbClose();
    }

    /**
     * Insert picture with backup flow properties into the database
     * @param picture Picture object
     */
    static insertBackupIntoDatabase(picture: IBase) {
        let db = new DbBackupFlow();

        db.insertRow(picture);
        db.dbClose();
    }

    /**
     * Insert picture with favorite flow properties into the database
     * @param picture Picture object
     */
    static insertFavoriteIntoDatabase(picture: IBase) {
        let db = new DbFavoriteFlow();

        db.insertRow(picture);
        db.dbClose();
    }

    /**
     * Insert picture with edited flow properties into the database
     * @param picture Picture object
     */
    static insertEditedIntoDatabase(picture: any) {
        let db = new DbEditedFlow();

        db.insertRow(picture);
        db.dbClose();
    }

    /**
     * Insert picture with social media flow properties into the database
     * @param picture Picture object
     */
    static AddSocialMediaPicture(picture: ISocialMedia) {
        let db = new DbSocialMediaFlow();

        db.insertRow(picture);
        db.dbClose();
    }

    /**
     * Insert picture with social media flow properties into the database
     * @param picture Picture object
     */
    static AddEditedPicture(picture: IEdited) {
        const db = new DbEditedFlow();

        db.insertRow(picture);
        db.dbClose();
    }

    /**
     * Delete a picture from the Social media flow
     * @param picture Social media picture object
     */
    static deleteSocialMediaPicture(picture: ISocialMedia) {
        const db = new DbSocialMediaFlow();

        db.deleteWhereSocialMedia(picture.socialMedia);
        db.dbClose();
    }

    /**
     * Delete a picture from the edited flow
     * @param picture Edited picture object
     */
    static deleteEditedPicture(picture: IEdited) {
        const db = new DbEditedFlow();

        db.deleteWhereEdited(picture.edited);
        db.dbClose();
    }

    /**
     * Insert settings default values
     */
    static defaultSettings() {
        const db = new DbSettings();

        if (db.isEmpty()) {
            let settings: ISettings = { conversion: "85", sofwarePostProcessing: "", uploadEdited: "", uploadSocialMedia: "" };
            db.insertRow(settings);
        }

        db.dbClose();
    }

    /**
     * Get the preview object of a picture
     * @param fullPath Full of the picture
     */
    static getPreviewPictureWhereName(fullPath: string): IPreview {
        let db = new DbPreviewFlow();
        let picture: IPreview = db.queryBaseWhereName(Helper.BasenameWithoutExtension(fullPath));
        db.dbClose();

        return picture;
    }

    /**
     * Delete the current selected album
     * @param album Current album
     */
    static deleteAlbum(album: IAlbum) {
        // Delete the album from the album table and from all flows
        const dbAlbum = new DbAlbum();
        dbAlbum.deleteAlbum(album.album);
        dbAlbum.dbClose();

        const dbPreviewFlow = new DbPreviewFlow();
        dbPreviewFlow.deletePicturesWhereAlbum(album.album);
        dbPreviewFlow.dbClose();

        const dbBaseFlow = new DbBaseFlow();
        dbBaseFlow.deletePicturesWhereAlbum(album.album);
        dbBaseFlow.dbClose();

        const dbBackupFlow = new DbBackupFlow();
        dbBackupFlow.deletePicturesWhereAlbum(album.album);
        dbBackupFlow.dbClose();

        const dbFavorite = new DbFavoriteFlow();
        dbFavorite.deletePicturesWhereAlbum(album.album);
        dbFavorite.dbClose();

        let dbEdited = new DbEditedFlow();
        dbEdited.deletePicturesWhereAlbum(album.album);
        dbEdited.dbClose();

        let dbSocialMedia = new DbSocialMediaFlow();
        dbSocialMedia.deletePicturesWhereAlbum(album.album);
        dbSocialMedia.dbClose();
    }

    /**
     * Update the current album
     * @param current Current album
     * @param updated Updated album
     */
    static updateAlbum(current: IAlbum, updated: IAlbum) {
        // Create database
        let dbAlbum = new DbAlbum();
        dbAlbum.updateAlbum(current, updated);
        dbAlbum.dbClose();

        // Edit the album name in associated tables
        let backupDb = new DbBackupFlow();
        backupDb.updateAlbum(current, updated);
        backupDb.dbClose();

        let baseDb = new DbBaseFlow();
        baseDb.updateAlbum(current, updated);
        baseDb.dbClose();

        let previewDb = new DbPreviewFlow();
        previewDb.updateAlbum(current, updated);
        previewDb.dbClose();

        let favoriteDb = new DbFavoriteFlow();
        favoriteDb.updateAlbum(current, updated);
        favoriteDb.dbClose();

        let editedDb = new DbEditedFlow();
        editedDb.updateAlbum(current, updated);
        editedDb.dbClose();

        let socialMediaDb = new DbSocialMediaFlow();
        socialMediaDb.updateAlbum(current, updated);
        socialMediaDb.dbClose();
    }

    /**
     * Get all the pictures within the base flow
     * @param album Album object
     */
    static getBaseFlowPictures(album: IAlbum): IBase[] {
        let db = new DbBaseFlow();
        let pictures: IBase[] = db.queryBaseFlow(album.album);
        db.dbClose();

        return pictures;
    }

    /**
     * Get all the pictures within the preview flow
     * @param album Album object
     */
    static getPreviewFlowPictures(album: IAlbum): IPreview[] {
        let db = new DbPreviewFlow();
        let pictures: IPreview[] = db.queryPreviewFlow(album.album);
        db.dbClose();

        return pictures;
    }


    /**
     * Get all the pictures within the edited flow
     * @param album Album object
     */
    static getEditedFlowPictures(album: IAlbum): IEdited[] {
        let db = new DbEditedFlow();
        let pictures: IEdited[] = db.queryEditedFlow(album.album);
        db.dbClose();

        return pictures;
    }

    /**
     * Get all the pictures within the social-media flow
     * @param album Album object
     */
    static getSocialMediaFlowPictures(album: IAlbum): ISocialMedia[] {
        let db = new DbSocialMediaFlow();
        let pictures: ISocialMedia[] = db.queryEditedFlow(album.album);
        db.dbClose();

        return pictures;
    }

    /**
     * Update a base flow picture object
     * @param picture Base flow picture object
     */
    static updateBaseFlow(picture: IBase) {
        let baseUpdated: IBase = { base: picture.base, preview: picture.preview, album: picture.album, baseUpdated: picture.baseUpdated };
        let previewUpdated: IBase = { base: picture.baseUpdated, preview: picture.preview, album: picture.album, previewUpdated: picture.previewUpdated };

        const db = new DbBaseFlow();
        db.updateBase(baseUpdated);
        db.updatePreview(previewUpdated);
        db.dbClose();
    }

    /**
     * Update a preview flow picture object
     * @param picture Preview flow picture object
     */
    static updatePreviewFlow(picture: IPreview) {
        let baseUpdated: IPreview = { base: picture.base, preview: picture.preview, album: picture.album, baseUpdated: picture.baseUpdated };
        let previewUpdated: IPreview = { base: picture.baseUpdated, preview: picture.previewUpdated, album: picture.album, previewUpdated: picture.previewUpdated };

        const db = new DbPreviewFlow();
        db.updateBase(baseUpdated);
        db.updatePreview(previewUpdated);
        db.dbClose();
    }

    /**
     * Update the is organized status of an album
     * @param album Album object
     * @param isOrganized Is organized boolean
     */
    static updateAlbumIsOrganized(album: IAlbum, isOrganized: boolean) {
        const db = new DbAlbum();
        db.updateStartedRecord(isOrganized ? 1 : 0, album.album);
        db.dbClose();
    }
}
