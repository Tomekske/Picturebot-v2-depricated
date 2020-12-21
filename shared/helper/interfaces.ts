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
    Raw: string[]
}