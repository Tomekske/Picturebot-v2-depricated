import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IAlbum, IBase, IFlow } from '../../../shared/database/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _collection: string;
  private _srcCollection = new Subject<string>();
  public ctxCollection = this._srcCollection.asObservable();

  private _albums: IAlbum[] = [];
  private _srcAlbums = new Subject<IAlbum[]>();
  public ctxAlbums = this._srcAlbums.asObservable();

  private _selectedAlbum: IAlbum;
  private _srcSelectedAlbum = new Subject<IAlbum>();
  public ctxSelectedAlbum = this._srcSelectedAlbum.asObservable();

  private _selectedFlow: string;
  private _srcSelectedFlow = new Subject<string>();
  public ctxSelectedFlow = this._srcSelectedFlow.asObservable();

  private _isAlbumSelectorVisible: boolean;
  private _srcAlbumSelectorVisible = new Subject<boolean>();
  public ctxAlbumSelectorVisible = this._srcAlbumSelectorVisible.asObservable();

  private _flows: IFlow;
  private _dictStarted = new Object();
  private _pictures: IBase[] = [];

  constructor() { }

  /**
   * Set the selected collection
   */
  set selectedCollection(collection) {
    this._collection = collection;
    this._srcCollection.next(collection);
  }

  /**
   * Get the selected collection
   */
  get selectedCollection(): string {
    return this._collection;
  }

  /**
   * Set the selected album within a collection
   */
  set albumsInCollection(albums: IAlbum[]) {
    this._albums = albums;
    this._srcAlbums.next(albums);
  }

  /**
   * Get the selected album within a collection
   */
  get albumsInCollection(): IAlbum[] {
    return this._albums;
  }

  /**
   * Set a selected album
   */
  set selectedAlbum(album: IAlbum) {
    this._selectedAlbum = album;
    this._srcSelectedAlbum.next(album);
  }

  /**
   * Get the selected album
   */
  get selectedAlbum(): IAlbum {
    return this._selectedAlbum;
  }

  /**
   * Set a selected flow
   */
  set selectedFlow(flow: string) {
    this._selectedFlow = flow;
    this._srcSelectedFlow.next(flow);
  }

  /**
   * Get the selected flow
   */
  get selectedFlow() {
    return this._selectedFlow;
  }

  /**
   * Set a selected flow within a collection
   */
  set flowsInCollection(flows: IFlow) {
    this._flows = flows;
  }

  /**
   * Get the selected flow within a collection
   */
  get flowsInCollection(): IFlow {
    return this._flows;
  }

  /**
   * Set the started album
   * @param album The started album
   * @param state The album's organized state
   */
  setAlbumStarted(album: string, state: boolean) {
    this._dictStarted[album] = state;
  }

  /**
   * Get the started album
   * @param album Album that gets returned
   */
  getAlbumStarted(album: string): boolean {
    return this._dictStarted[album];
  }

  /**
   * Set the pictures list
   */
  set picturesList(pictures: IBase[]) {
    this._pictures = pictures;
  }

  /**
   * Get the pictures list
   */
  get picturesList(): IBase[] {
    return this._pictures;
  }

  /**
   * Set the is album selector visible state
   */
  set isAlbumSelectorVisible(state: boolean) {
    this._isAlbumSelectorVisible = state;
    this._srcAlbumSelectorVisible.next(state);
  }

  /**
   * Get the is album selector visible state
   */
  get isAlbumSelectorVisible(): boolean {
    return this._isAlbumSelectorVisible;
  }
}
