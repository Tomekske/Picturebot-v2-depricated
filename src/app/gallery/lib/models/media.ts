import { SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { IDisplay } from '../../../../../shared/database/interfaces';

export class Media {
    type: string = 'img';
    description: string;
    previewUrl: string | SafeResourceUrl | SafeUrl;
    display: IDisplay;

    constructor(public url: string | SafeResourceUrl | SafeUrl, public title: string, display: IDisplay, type: string = 'img') {
        this.previewUrl = url;
        this.display = display;
        this.type = type;
    }
}