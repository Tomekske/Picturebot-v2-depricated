import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { PicturesComponent } from './pictures/pictures.component'
import { CrystalLightboxModule } from '@crystalui/angular-lightbox';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, MenuComponent, SettingsComponent, ToolbarComponent, LibraryComponent, AlbumComponent, CollectionComponent, PicturesComponent],
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
    CrystalLightboxModule,
    FlexLayoutModule,
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
      {path: 'addLibrary', component: LibraryComponent}
    ])
  ],
  providers: [DataService, {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}],
  bootstrap: [AppComponent]
})
export class AppModule {}
