import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs';
import { IAlbum, IFlow } from '../../shared/database/interfaces';
import { ElectronService } from './core/services/electron/electron.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _collection: string;
  private _albums: IAlbum[] = [];
  private _selectedAlbum: IAlbum;
  private _selectedFlow: string;
  private _flows: IFlow;

  private _srcCollection = new Subject<string>();
  private _srcAlbums = new Subject<IAlbum[]>();
  private _srcSelectedAlbum = new Subject<IAlbum>();
  private _srcSelectedFlow = new Subject<string>();

  public ctxCollection = this._srcCollection.asObservable();
  public ctxAlbums = this._srcAlbums.asObservable();
  public ctxSelectedAlbum = this._srcSelectedAlbum.asObservable();
  public ctxSelectedFlow = this._srcSelectedFlow.asObservable();

  constructor(private _electron: ElectronService) { }

  set selectedCollection(collection) {
    this._collection = collection;
    this._srcCollection.next(collection);
  }

  get selectedCollection(): string {
    return this._collection;
  }

  //=======================

  set albumsInCollection(albums: IAlbum[]) {
    this._albums = albums;
    this._srcAlbums.next(albums);
  }

  get albumsInCollection(): IAlbum[] {
    return this._albums;
  }

  //=======================

  set selectedAlbum(album: IAlbum) {
    this._selectedAlbum = album;
    this._srcSelectedAlbum.next(album);
  }

  get selectedAlbum(): IAlbum {
    return this._selectedAlbum;
  }

  //=======================

  set selectedFlow(flow: string) {
    this._selectedFlow = flow;
    this._srcSelectedFlow.next(flow);
  }

  get selectedFlow() {
    return this._selectedFlow;
  }

    //=======================
  set flowsInCollection(flows: IFlow) {
    this._flows = flows;
  }

  get flowsInCollection(): IFlow {
    return this._flows;
  }
}
