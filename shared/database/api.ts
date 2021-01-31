import * as path from 'path';
import { Logger } from '../../shared/logger/logger';
import { IAlbum, IBase, IFlow } from '../database/interfaces';
import { Helper } from '../helper/helper';
import { DbCollection } from '../database/dbCollection';
import { DbAlbum } from './dbAlbum';
import { DbBaseFlow } from './dbBaseFlow';
import { DbPreviewFlow } from './dbPreviewFlow';
import { DbBackupFlow } from './dbBackupFlow';
import { DbFavoriteFlow } from './dbFavoriteFlow';
import { DbEditedFlow } from './dbEditedFlow';
import { DbSocialMediaFlow } from './dbSocialMediaFlow';

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
              if(flow != flows.favorites) {
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
        const collectionDb = new DbCollection();
        let flows: IFlow = collectionDb.queryAllFlows(album.collection);
        collectionDb.dbClose();

        return flows;
    }

    /**
     * Insert picture with base flow properties into the database
     * @param picture Picture object
     */
    static insertBaseIntoDatabase(picture: IBase) {
        const picDb = new DbBaseFlow();
        picDb.insertRow(picture);
        picDb.dbClose();
    }

    /**
     * Insert picture with preview flow properties into the database
     * @param picture Picture object
     */
    static insertPreviewIntoDatabase(picture: IBase) {
        const picDb = new DbPreviewFlow();
        picDb.insertRow(picture);
        picDb.dbClose();
    }

    /**
     * Insert picture with backup flow properties into the database
     * @param picture Picture object
     */
    static insertBackupIntoDatabase(picture: IBase) {
        const picDb = new DbBackupFlow();
        picDb.insertRow(picture);
        picDb.dbClose();
    }

    /**
     * Insert picture with favorite flow properties into the database
     * @param picture Picture object
     */
    static insertFavoriteIntoDatabase(picture: IBase) {
        const picDb = new DbFavoriteFlow();
        picDb.insertRow(picture);
        picDb.dbClose();
    }

    /**
     * Insert picture with edited flow properties into the database
     * @param picture Picture object
     */
    static insertEditedIntoDatabase(picture: any) {
        const picDb = new DbEditedFlow();
        picDb.insertRow(picture);
        picDb.dbClose();
    }

    /**
     * Insert picture with social media flow properties into the database
     * @param picture Picture object
     */
    static insertSocialMediaIntoDatabase(picture: any) {
        const picDb = new DbSocialMediaFlow();
        picDb.insertRow(picture);
        picDb.dbClose();
    }
}
