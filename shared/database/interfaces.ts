/**
 * Interface containing library properties
 */
export interface ILibrary {
    /** Library name */
    name: string;
    /** Library base path */
    base: string;
    /** Library full path (~/base/name) */
    library?: string;
}

/**
 * Interface containing settings properties
 */
export interface ISettings {
    /** Upload URL for pictures within the edited flow */
    uploadEdited?: string;
    /** Upload URL for pictures within the edited flow */
    uploadSocialMedia?: string;
    /** Path to the software used to edit pictures */
    sofwareEditing?: string;
    /** Path to the software used to post-process pictures */
    sofwarePostProcessing?: string;
    /** Default file type */
    fileType?: string;
    /** Default error logging level */
    logLevel?: string;
    /** Default RAW picture conversion percentage */
    conversion?: string;
}

/**
 * Interface containing flow properties
 */
export interface IFlow {
    /** Backup flow name */
    backup?: string;
    /** Base flow name */
    base?: string;
    /** Preview flow name */
    preview?: string;
    /** files flow name */
    files?: string;
    /** Edited flow name */
    edited?: string;
    /** Social-media flow name */
    socialMedia?: string;
    /** Selection flow name */
    selection?: string;
}

/**
 * Interface containing collection properties
 */
export interface ICollection extends IFlow {
    /** The library where the collection is located in */
    library?: string;
    /** Collection name */
    name?: string;
    /** Collection full path (~/library/name) */
    collection?: string;
}

/**
 * Interface containing album properties
 */
export interface IAlbum {
    /** The collection where the album is located in */
    collection?: string;
    /** Album name */
    name?: string;
    /** Album date */
    date?: string;
    /** Album full path (~/collection/name_date) */
    album?: string;
    /** Checks if organizing has started */
    started?: number;
}

/**
 * Interface containing picture properties
 */
interface IPicture {
    /** Picture name */
    name?: string;
    /** Date when the picture was taken */
    modification?: Date;
    /** Hashed file name */
    hashed?: string;
    /** Collection where the picture is located in */
    collection?: string;
    /** Album where the picture is located in */
    album?: string;
    /** Creation date of the picture */
    date?: string;
    /** Creation time of the picture */
    time?: string;
    /** Source location of the picture */
    source?: string;
}

/**
 * Interface containing baseFLow properties
 */
export interface IBase extends IPicture {
    /** Check wether a picture is favorited */
    favorited?: number;
    /** Backup location of the file */
    backup?: string;
    /** Base location of the file */
    base?: string;
    /** Location of the converted picture */
    preview?: string;
}

/**
 * Interface containing backup properties
 */
export interface IBackup extends IPicture {
    /** Base location of the file */
    base?: string;
    /** Backup location of the file */
    backup?: string; 
}

/**
 * Interface containing previewFlow properties
 */
export interface IPreview extends IPicture {
    /** Destination of the RAW picture */
    base: string;
    /** Location of the converted picture */
    preview: string;
}
