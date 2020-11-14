import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private electron: ElectronService, private translate: TranslateService) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit() { }
}
