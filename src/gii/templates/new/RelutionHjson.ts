import * as uuid from 'node-uuid';
import {FileApi} from './../../../utility/FileApi';
import {Translation} from './../../../utility/Translation';
import {TemplateInterface} from './../../TemplateInterface';
/**
 * create the RelutionHjson file for the Project
 */

export class RelutionHjson implements TemplateInterface {

  public publishName: string = 'relution.hjson'
  public name: string = 'app';

  private _description : string;
  private _fileApi: FileApi = new FileApi();
  private _uuid: string;
  private _directoryIndex: boolean = false;
  private _server: string = './app.js';
  private _private: boolean = false;

  get template() {
    return this._fileApi.copyHjson(
      `
{
  //app name
  name: ${this.name},
  //description for the project
  description: ${this.description},
  //on which baseAlias the app is available
  baseAlias: /${this.name},
  //uuid identifier
  uuid: ${this.uuid},
  //node start script
  server: ${this.server},
  //shows directoryIndex on the Server good for debugging
  directoryIndex: ${this.directoryIndex},
  //@todo have to be defined
  private: ${this.private}
}
`
    ).trim();
  }

  /**
   * The Description for the Project
   */
  public get description() : string {
    if (!this._description ||this._description.length) {
      this.description = Translation.RH_DESCRIPTION(this.name);
    }
    return this._description;
  }

  public set description(v : string) {
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
    return this._server;
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

}
