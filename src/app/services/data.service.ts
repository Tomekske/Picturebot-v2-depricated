import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IAlbum, IBase, IFlow } from '../../../shared/database/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _selectedCollection: string;
  private _srcSelectedCollection = new BehaviorSubject<string>("");
  public ctxSelectedCollection = this._srcSelectedCollection.asObservable();

  private _selectedFlow: string;
  private _srcSelectedFlow = new BehaviorSubject<string>("");
  public ctxSelectedFlow = this._srcSelectedFlow.asObservable();

  private _albums: IAlbum[] = [];
  private _srcAlbums = new Subject<IAlbum[]>();
  public ctxAlbums = this._srcAlbums.asObservable();

  private _selectedAlbum: IAlbum;
  private _srcSelectedAlbum = new BehaviorSubject<IAlbum>({});
  public ctxSelectedAlbum = this._srcSelectedAlbum.asObservable();

  private _isAlbumDeleted: boolean;
  private _srcIsAlbumDeleted = new Subject<boolean>();
  public ctxIsAlbumDeleted = this._srcIsAlbumDeleted.asObservable();

  private _isAlbumUpdated: boolean;
  private _srcIsAlbumUpdated = new Subject<boolean>();
  public ctxIsAlbumUpdated = this._srcIsAlbumUpdated.asObservable();

  private _isStarted: boolean;
  private _srcIsStarted = new Subject<boolean>();
  public ctxIsStarted = this._srcIsStarted.asObservable();

  private _isAlbumSelectorVisible: boolean;
  private _srcAlbumSelectorVisible = new BehaviorSubject<boolean>(false);
  public ctxAlbumSelectorVisible = this._srcAlbumSelectorVisible.asObservable();

  private _flows: IFlow;
  private _dictStarted = new Object();
  private _pictures: IBase[] = [];

  private _isPictures: boolean;
  private _srcIsPictures = new BehaviorSubject<boolean>(true);
  public ctxIsPictures = this._srcIsPictures.asObservable();

  private _menuText: string;
  private _srcMenuText = new Subject<string>();
  public ctxMenuText = this._srcMenuText.asObservable();

  private _isCollectionSaved: boolean;
  private _srcIsCollectionSaved = new Subject<boolean>();
  public ctxIsCollectionSaved = this._srcIsCollectionSaved.asObservable();

  private _isAlbumSaved: boolean;
  private _srcIsAlbumSaved = new Subject<boolean>();
  public ctxIsAlbumSaved = this._srcIsAlbumSaved.asObservable();

  constructor() { }

  /**
   * Set the selected collection
   */
  set selectedCollection(collection) {
    this._selectedCollection = collection;
    this._srcSelectedCollection.next(collection);
  }

  /**
   * Get the selected collection
   */
  get selectedCollection(): string {
    return this._selectedCollection;
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

  /**
   * Set the is album deleted state
   */
  set isAlbumDeleted(state: boolean) {
    this._isAlbumDeleted = state;
    this._srcIsAlbumDeleted.next(state);
  }

  /**
   * Get the is album deleted state
   */
  get isAlbumDeleted() {
    return this._isAlbumDeleted;
  }

  /**
   * Set the is album updated state
   */
  set isAlbumUpdated(state: boolean) {
    this._isAlbumUpdated = state;
    this._srcIsAlbumUpdated.next(state);
  }

  /**
   * Get the is album updated state
   */
  get isAlbumUpdated() {
    return this._isAlbumUpdated;
  }

  /**
   * Set the is started state
   */
  set IsStarted(state: boolean) {
    this._isStarted = state;
    this._srcIsStarted.next(state);
  }

  /**
   * Get the is started state
   */
  get IsStarted() {
    return this._isStarted;
  }

  /**
   * Set the is picture state
   */
  set IsPictures(state: boolean) {
    this._isPictures = state;
    this._srcIsPictures.next(state);
  }

  /**
   * Get the is picture state
   */
  get IsPictures() {
    return this._isPictures;
  }

  /**
   * Set the is menu text
   */
  set MenuText(text: string) {
    this._menuText = text;
    this._srcMenuText.next(text);
  }

  /**
   * Get the is menu text
   */
  get MenuText() {
    return this._menuText;
  }

  /**
   * Get the is collection saved state
   */
  set IsCollectionSaved(state: boolean) {
    this._isCollectionSaved = state;
    this._srcIsCollectionSaved.next(state);
  }

  /**
   * Set the is collection saved state
   */
  get IsCollectionSaved() {
    return this._isCollectionSaved;
  }

    /**
   * Set the is album saved state
   */
  set isAlbumSaved(state: boolean) {
    this._isAlbumSaved = state;
    this._srcIsAlbumSaved.next(state);
  }

  /**
   * Get the is album saved state
   */
  get isAlbumSaved() {
    return this._isAlbumSaved;
  }
}
