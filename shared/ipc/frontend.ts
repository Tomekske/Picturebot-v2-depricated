import { ipcRenderer } from 'electron';
import { IAlbum, IBase, IFlow, ILegacy } from '../database/interfaces';

/**
 * Static class contains methods to communicate with the backend 
 */
export class IpcFrontend {
    /**
     * Get settings from the database
     */
    static getSettings() {
        return ipcRenderer.sendSync("get-settings");
    }

    /**
     * Save settings to the database
     * @param data Form data which is stored within the database
     */
    static saveSettings(data) {
        ipcRenderer.send("save-settings", data);
    }

    /**
     * Check wether the settings row is empty
     */
    static checkSettingsEmpty() {
        return ipcRenderer.sendSync("check-settings-empty");
    }

    /**
     * Get all libraries from the database
     */
    static getLibraries() {
        return ipcRenderer.sendSync("get-libraries");
    }

    /**
     * Save library to the database
     * @param data Form data which is stored within the database
     */
    static saveLibrary(data) {
        ipcRenderer.send("save-library", data);
    }

    /**
     * Get all collections from the database
     */
    static getCollections() {
        return ipcRenderer.sendSync("get-collections");
    }

    /**
     * Method to query all values from the collection table of a specified collection
     * @param collection Selected collection
     */
    static getAllCollectionWhereCollection(collection: string) {
        return ipcRenderer.sendSync("get-all-collections-where-collection", collection);
    }

    /**
     * Save collection to the database
     * @param data Form data which is stored within the database
     */
    static saveCollection(data) {
        ipcRenderer.send("save-collection", data);
    }

    /**
     * Hashed pictures which are saved to the database
     * @param pictures Pictures that are saved to the database
     * @param album The album where the pictures should be stored in
     */
    static savePictures(pictures: IBase[], album: IAlbum) {
        ipcRenderer.sendSync("save-pictures", pictures, album);
    }

    /**
     * Update the name object of the preview flow
     * @param data The updated value
     */
    static updatePreviewFlowName(data) {
        ipcRenderer.sendSync("update-name-previewFlow", data);
    }

    /**
     * Get pictures from a specified album of the preview flow
     * @param album Selected album
     */
    static getPreviewFlowPictures(album: string) {
        return ipcRenderer.sendSync("get-previewFLow-pictures", album);
    }

    /**
     * Update the name object of the base flow
     * @param data The updated value
     */
    static updateBaseFlowName(data) {
        ipcRenderer.sendSync("update-name-baseFlow", data);
    }

    /**
     * Get pictures from a specified album of the base flow
     * @param album Selected album
     */
    static getBaseFlowPictures(album: string) {
        return ipcRenderer.sendSync("get-baseFLow-pictures", album);
    }

    /**
     * Get pictures from a specified album of the favorites flow
     * @param album Selected album
     */
    static getFavoritesFlowPictures(album: string) {
        return ipcRenderer.sendSync("get-favoritesFlow-pictures", album);
    }

    /**
     * Get the preview and base flow from a certain collection
     * @param collection Selected collection
     */
    static getStartingFlows(collection: string) {
        return ipcRenderer.sendSync("get-started-flow", collection);
    }

    /**
     * Update the isOrganized value of a certain album
     * @param album Selected album
     * @param isOrganized Updated value
     */
    static updateAlbumIsOrganized(album: IAlbum, isOrganized: boolean) {
        ipcRenderer.sendSync("update-album-started", album, isOrganized);
    }

    /**
     * Get albums from a specified album
     * @param collection Selected collection
     */
    static getAlbums(collection: string) {
        return ipcRenderer.sendSync("get-albums", collection);
    }

    /**
     * Save an album to the database
     * @param currentAlbum Selected album object
     * @param updatedAlbum Updated album object
     */
    static updateAlbum(currentAlbum: IAlbum, updatedAlbum: IAlbum) {
        ipcRenderer.sendSync("update-album", currentAlbum, updatedAlbum);
    }

    /**
     * Get the flows which are displayed in the tab component
     * @param collection Selected collection
     */
    static getTabFlows(collection: string): IFlow{
        return ipcRenderer.sendSync("get-tab-flows", collection);
    }

    /**
     * Delete a picture relation from the previewFlow table
     * @param path Path to the picture
     */
    static previewFlowDeletePicture(path: string) {
        ipcRenderer.sendSync("previewFlow-delete-picture", path);
    }

    /**
     * Delete a picture relation from the baseFlow table
     * @param path Path to the picture
     */
    static baseFlowDeletePicture(path: string) {
        ipcRenderer.sendSync("baseFlow-delete-picture", path);
    }

    /**
     * Delete a picture relation from the favoriteFlow table
     * @param path Path to the picture
     */
    static favoriteFlowDeletePicture(path: string) {
        ipcRenderer.sendSync("favoriteFlow-delete-picture", path);
    }

    /**
     * Delete an album reference from the database
     * @param album Album that get deleted
     */
    static deleteAlbum(album: IAlbum) {
        ipcRenderer.sendSync("delete-album", album);
    }

    /**
     * Get the favorite picture from the base flow from a preview picture
     * @param preview Selected preview picture
     */
    static getIsFavoriteBaseFlowWherePreview(preview: string) {
        return ipcRenderer.sendSync("get-isFavorite-baseFlow-where-preview", preview);
    }

    /**
     * Update the favorited boolean of a specified picture
     */
    static updateFavorited(preview: string, isFavorited: boolean) {
        ipcRenderer.sendSync("update-favorited", preview, isFavorited);
    }

    /**
     * Save a favorited picture to the favorite flow
     * @param favorite Selected favorite
     */
    static saveFavorite(favorite: IBase) {
        ipcRenderer.sendSync("save-favorite", favorite);
    }

    /**
     * Delete a favorited picture from the favorite flow
     * @param favorite Selected favorite
     */
    static deleteFavoriteWhereBase(favorite: string) {
        ipcRenderer.sendSync("delete-favorite-where-base", favorite);
    }

    /**
     * Set the selected album
     * @param album Selected album
     */
    static selectedAlbum(album: IAlbum) {
        ipcRenderer.sendSync("selected-album", album);
    }

    /**
     * Get pictures from a specified album of the edited flow
     * @param album Selected album
     */
    static getEditedFlowPictures(album: string) {
        return ipcRenderer.sendSync("get-editedFlow-pictures", album);
    }

    /**
     * Get pictures from a specified album of the social media flow
     * @param album Selected album
     */
    static getSocialMediaFlowPictures(album: string) {
        return ipcRenderer.sendSync("get-socialMediaFlow-pictures", album);
    }

    /**
     * Import a legacy album into the system
     * @param form legacy m object
     */
    static importLegacyAlbum(form: ILegacy) {
        ipcRenderer.sendSync("import-legacy-album", form);
    }

    /**
     * Static method to start organize an album
     * @param album Album object
     */
    static startOrganizingAlbum(album: IAlbum) {
        ipcRenderer.sendSync("start-organizing-album", album);
    }
}
