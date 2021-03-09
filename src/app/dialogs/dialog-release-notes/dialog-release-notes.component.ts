import { Component, OnInit } from '@angular/core';
import { Logger } from '../../../../shared/logger/logger';

@Component({
  selector: 'app-dialog-release-notes',
  templateUrl: './dialog-release-notes.component.html',
  styleUrls: ['./dialog-release-notes.component.css']
})
export class DialogReleaseNotesComponent implements OnInit {
  location: string = "assets/release_notes.md"

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Method to log markdown viewer errors
   * @param error Error object
   */
  onError(error) {
    Logger.Log().error(error);
  }

  /**
   * Method to log markdown on load event
   * @param event Load object
   */
  onLoad(event) {
    Logger.Log().debug(event);
  }
}
