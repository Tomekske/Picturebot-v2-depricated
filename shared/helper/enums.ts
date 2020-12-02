import { IRegex } from './interfaces';
import * as path from 'path';
import { Helper } from '../helper/helper';

/**
 * Enum contains frequently used regex expressions
 */
export let Regex: IRegex = {
    /** Website URL validator */
    Website: "^(http[s]?:\/\/){0,1}(www.){0,1}[a-zA-Z0-9.-]+.[a-zA-Z]+\/.+",
    /** Percentage 1-100 validator */
    Percentage: "^(100|[1-9][0-9]?)$",
    /** Windows folder path validator */
    Folder: /^([a-zA-Z]):(\\\w+)+$/,
    /** Windows file path validator */ 
    File: /^([a-zA-Z]):\\(.+\\)*(.+)\.(.+)$/,
    /** Name must not contain white spaces validator */
    NameNoWhiteSpaces: /^(\w)+$/,
    /** Name contains white spaces validator */
    NameWhiteSpaces: /^(\w+\s*)+$/
}

/**
 * Enum contains frequently used error messages
 */
export enum Message {
    /** Required error message */
    Required = "Field is required",
    /** Incorrect percentage error message */
    Percentage = "Conversion must be between 1%-100%",
    /** Incorrect file error message */
    Executable = "Path is not an executable",
    /** Incorrect directory message */
    Directory = "Directory is incorrect",
    /** Incorrect website message */
    Website = "URL is incorrect",
    /** Dropzone error message */
    Dropzone = "Drop pictures into the dropzone",
    /** Field may only contain characters and optional white spaces */
    WhiteSpaces = "Field may only contain characters and optional white spaces",
    /** Field may not contain white spaces */
    NoWhiteSpaces = "Field may only contain characters and optional white spaces"
}

/**
 * Enum contains application metadata
 */
export enum App {
    /** Application name */
    name = "Picturebot",
    productionDb = "database.db",
    debugDb = "debug.db"
}
