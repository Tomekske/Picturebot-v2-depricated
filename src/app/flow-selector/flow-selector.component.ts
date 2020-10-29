import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';
import { IFlow, IBase } from '../../../shared/database/interfaces';
import { Logger } from '../../../shared/logger/logger';
import { DataService } from '../data.service';

@Component({
  selector: 'app-flow-selector',
  templateUrl: './flow-selector.component.html',
  styleUrls: ['./flow-selector.component.css']
})
export class FlowSelectorComponent implements OnInit {
  flows: string[] = [];
  selected: string;

  constructor(private electron: ElectronService, private _data: DataService) { }

  ngOnInit(): void {
    this._data.ctxCollection.subscribe((collection) => {
      this.flows = [];
      let flow: IFlow = this.electron.ipcRenderer.sendSync("get-flows", collection);
      this._data.flowsInCollection = flow;
      this.flows.push(flow.preview);
      this.flows.push(flow.edited);
      this.flows.push(flow.socialMedia);

      this.selectedFlow(flow.preview);
    });
  }
  
  selectedFlow(flow) {
    this.selected = flow;
    this._data.selectedFlow = flow;
  }
}
