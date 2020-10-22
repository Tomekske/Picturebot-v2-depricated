export interface ILibrary {
    name: string;
    base: string;
    library?: string;
}

export interface ISettings {
    uploadEdited?: string;
    uploadSocialMedia?: string;
    sofwareEditing?: string;
    sofwarePostProcessing?: string;
    fileType?: string;
    logLevel?: string;
    conversion?: string;
}

export interface IFlow {
    backup?: string,
    base: string,
    preview: string,
    files?: string,
    edited: string,
    socialMedia: string,
    selection?: string
}

export interface ICollection extends IFlow {
    library: string,
    name: string,
    collection?: string
}

export interface IAlbum {
    collection: string,
    name: string,
    date: string,
    album: string,
    started: number
}

interface IPicture {
    name?: string,
    modification?: Date,
    hashed?: string,
    collection?: string,
    album?: string
}

export interface IBase extends IPicture {
    selection?: number,
    source?: string,
    destination?: string
}

export interface IPreview extends IPicture {
    base: string,
    preview: string
}
