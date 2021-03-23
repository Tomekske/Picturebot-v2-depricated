/**
 * Interface contains regex properties
 */
export interface IRegex {
    /** Website URL validator */
    Website: string;
    /** Percentage 1-100 validator */
    Percentage: string;
    /** Windows folder path validator */
    Folder: RegExp;
    /** Windows file path validator */
    File: RegExp;
    /** Name must not contain white spaces validator */
    NameNoWhiteSpaces: RegExp;
    /** Name contains white spaces validator */
    NameWhiteSpaces: RegExp;
}

/**
 * Interface contains frequently used filetypes
 */
export interface IFileTypes {
    /** RAW file types */
    Raw: string[];
}

/**
 * Interface contains library - collection dictionary
 */
export interface ICollectionSelector {
    /** Library name of the collection */
    library: {
        /** Base name of the library */
        basename: string;
        /** Full path of the library name */
        fullPath: string;
    },
    /** Collection name */
    collections?: {
        /** Base name of the library */
        basename: string;
        /** Full path of the library name */
        fullPath: string;
    }[];
}
