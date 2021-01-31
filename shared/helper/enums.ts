import { IRegex, IFileTypes } from './interfaces';
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
    Folder: /[a-zA-Z]:[\\\/]([\w+\s]+[\\\/]?)+/,
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
    NoWhiteSpaces = "Field is not allowed to contain white spaces",
    /** No libraries error */
    Library = "Please add a library",
    /** Conversion rate isn't configured in the settings page */
    PercentageSettings = "Configure the conversion rate in the settings page",
    /** Incorrect File extension error message */
    Extension = "Files are not a RAW format"
}

/**
 * Enum contains application metadata
 */
export enum App {
    /** Application name */
    name = "Picturebot",
    /** Production database name */
    productionDb = "database.db",
    /** Debug database name */
    debugDb = "debug.db"
}

/**
 * Enum contains menu page titles
 */
export enum MenuText {
    /** Library page name */
    library = "Add a library page",
    /** Collection page name */
    collection = "Add a collection page",
    /** Album page name */
    album = "Add an album page",
    /** Settings page name */
    settings = "Settings page"
}

/**
 * Enum contains frequently used filetypes
 */
export let FileTypes: IFileTypes = {
    Raw: [".K25", ".CR", ".CR2", ".CR3", ".ARI", ".ARW", ".EIP", ".NRW", ".RWZ", ".RW2", ".NEF", ".RAF", ".RAW", ".DCR", ".DNG", ".SRF", ".3FR", ".MEF", ".FFF", ".MOS", ".MFW", ".CRW", ".BAY", ".ORF", ".SR2", ".SRW", ".J6I", ".RWL", ".CS1", ".KDC", ".X3F", ".ERF", ".MRW", ".IIQ", ".PEF", ".CXI"]
}
