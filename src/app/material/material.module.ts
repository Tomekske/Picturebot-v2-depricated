import { NgModule } from '@angular/core';
import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';

import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list'
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';


const MaterialComponents = [
  NgMaterialMultilevelMenuModule,
  MatButtonModule,
  MatListModule,
  MatCardModule,
  MatMenuModule,
  MatIconModule,
  MatFormFieldModule,
  MatSelectModule,
  ScrollingModule,
  MatTabsModule,
  MatInputModule,
  MatSnackBarModule,
  MatDatepickerModule,
  MatNativeDateModule
];


@NgModule({
  imports: [ MaterialComponents ],
  exports: [MaterialComponents ]
})
export class MaterialModule { }
