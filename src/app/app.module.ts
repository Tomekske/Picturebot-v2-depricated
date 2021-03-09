import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ListViewModule } from '@syncfusion/ej2-angular-lists';
import { RouterModule } from '@angular/router';
// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu-component/menu/menu.component';
import { SettingsComponent } from './menu-component/settings/settings.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LibraryComponent } from './menu-component/library/library.component';
import { AlbumComponent } from './menu-component/album/album.component';
import { CollectionComponent } from './menu-component/collection/collection.component';

import { DataService } from './services/data.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './extra/material.module';
import { FlexLayoutModule } from '@angular/flex-layout'
import { DateAdapter, MatDateFormats, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { PicturesComponent } from './pictures/pictures.component'
import { DialogPictureInfoComponent } from './dialogs/dialog-picture-info/dialog-picture-info.component';
import { DialogPictureDeleteComponent } from './dialogs/dialog-picture-delete/dialog-picture-delete.component';
import { DialogAlbumDeleteComponent } from './dialogs/dialog-album-delete/dialog-album-delete.component';
import { DialogAlbumEditComponent } from './dialogs/dialog-album-edit/dialog-album-edit.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DialogImportLegacyComponent } from './dialogs/dialog-import-legacy/dialog-import-legacy.component';
import { NgOpengalleryModule } from 'app/gallery/public-api';
import { DialogReleaseNotesComponent } from './dialogs/dialog-release-notes/dialog-release-notes.component';
import { MarkdownModule } from 'ngx-markdown';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const MY_FORMATS: MatDateFormats = {
  parse: {
      dateInput: 'DD/MM/YYYY',
  },
  display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [AppComponent, 
    MenuComponent, 
    SettingsComponent, 
    ToolbarComponent, 
    LibraryComponent, 
    AlbumComponent, 
    CollectionComponent, 
    PicturesComponent, 
    DialogPictureInfoComponent, 
    DialogPictureDeleteComponent, 
    DialogAlbumDeleteComponent, 
    DialogAlbumEditComponent, 
    DialogImportLegacyComponent, 
    DialogReleaseNotesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    NgxDropzoneModule,
    ListViewModule,
    NgbModule,
    FlexLayoutModule,
    CommonModule,
    NgOpengalleryModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot([
      {path: 'main', component: PicturesComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'addAlbum', component: AlbumComponent},
      {path: 'addCollection', component: CollectionComponent},
      {path: 'addLibrary', component: LibraryComponent},
    ], { onSameUrlNavigation: 'reload'})
  ],
  providers: [DataService, 
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
