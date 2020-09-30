export interface ILibrary {
    name: string;
    base: string;
    path?: string;
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
    backup: string,
    base: string,
    preview: string,
    files: string,
    edited: string,
    socialMedia: string,
    selection: string
}

export interface ICollection extends IFlow {
    library: string,
    name: string,
    path?: string
}

export interface IAlbum {
    collection: string,
    name: string,
    date: string,
    path: string
}

interface IPicture {
    name?: string,
    source: string,
    destination?: string
}

export interface IBase extends IPicture {
    selection?: number
}