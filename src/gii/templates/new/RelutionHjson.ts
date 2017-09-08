import * as uuid from 'uuid';
import {FileApi} from './../../../utility/FileApi';
import {Translation} from './../../../utility/Translation';
import {TemplateInterface} from './../../TemplateInterface';
const html = require('common-tags').html;
/**
 * create the RelutionHjson file for the Project
 */

export class RelutionHjson implements TemplateInterface {

  public publishName: string = 'relution.hjson';
  public name: string = 'app';

  private _description: string;
  private _fileApi: FileApi = new FileApi();
  private _uuid: string;
  private _directoryIndex: boolean = true;
  private _server: string = 'app.js';
  private _private: boolean = false;
  private _baseAlias: string;
  private _client: string = './www';

  get template() {
    return this._fileApi.copyHjson(html`
      {
        //app name
        name: ${this.name}
        //description for the project
        description: ${this.description}
        //on which baseAlias the app is available
        baseAlias: ${this.baseAlias}
        //uuid identifier dont touch it!!!
        uuid: ${this.uuid}
        //static files root folder to your client application
        client: ${this.client}
        //node start script
        server: ${this.server}
        //shows directoryIndex on the Server good for debugging
        //directoryIndex: ${this.directoryIndex}
        //if this attribute is set to true no anonymous user can see the app
        private: ${this.private}
      }
    `);
  }

  /**
   * The Description for the Project
   */
  public get description(): string {
    if (!this._description || !this._description.length) {
      this._description = Translation.RH_DESCRIPTION(this.name);
    }
    return this._description;
  }

  public set description(v: string) {
    this._description = v;
  }
  /**
   * is a private app or not
   */
  public get private(): boolean {
    return this._private;
  }

  public set private(v: boolean) {
    this._private = v;
  }

  /**
   * show the directory Index on the Server
   */
  public get directoryIndex(): boolean {
    return this._directoryIndex;
  }

  public set directoryIndex(v: boolean) {
    this._directoryIndex = v;
  }

  /**
   * which file would be start from Node
   */
  public get server(): string {
    return `./${this._server}`;
  }

  public set server(v: string) {
    this._server = v;
  }

  /**
   * set the uuid for the RelutionHjson if no is defined we are set one
   */
  public get uuid(): string {
    if (!this._uuid) {
      this._uuid = uuid.v1();
    }
    return this._uuid;
  }

  public set uuid(v: string) {
    this._uuid = v;
  }

  /**
   * set the baseALias to the app
   */
  public get baseAlias(): string {
    if (!this._baseAlias || !this._baseAlias.length) {
      this.baseAlias = this.name;
    }
    return `/${this._baseAlias}`;
  }

  public set baseAlias(v: string) {
    this._baseAlias = v;
  }

  public get client(): string {
    return this._client;
  }

  public set client(v: string) {
    this._client = v;
  }

}
