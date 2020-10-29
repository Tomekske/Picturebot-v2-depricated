import * as os from 'os';
import * as path from 'path';

/**
 * Static helper class containing helper methods
 */
export class Helper {
    /** Application name */
    static app: string = "Picturebot";

    /**
     * Build path to the user's documents
     */
    static pathMyDocuments(): string {
        return path.join(os.homedir(), "Documents");
    }
}