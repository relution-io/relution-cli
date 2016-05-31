import {FileApi} from './../utility/FileApi';
import {RxFs}  from './../utility/RxFs';

export interface PushInterface {
  providers: Array<IOSPush | AndroidPush>;
  pushFiles: Array<{ name: string, path: string }>;
};

export interface PushModelInterface {
  name: string;
  path: string;
  providers?: Array<IOSPush | AndroidPush>;
};

export class PushModel implements PushModelInterface {
  /**
   * name from the file without extension
   */
  private _name: string;
  /**
   * available providers
   */
  private _providers: Array<IOSPush | AndroidPush>;
  /**
   * file path
   */
  private _path: string;

  constructor(params?: Array<PushModelInterface>) {
    Object.keys(params[0]).forEach((key) => {
      this[key] = params[0][key];
    });
  }

  public get name(): string {
    return this._name;
  }

  public set name(v: string) {
    this._name = v;
  }

  public get path(): string {
    return this._path;
  }

  public set path(v: string) {
    this._path = v;
  }

  public get providers(): Array<IOSPush | AndroidPush> {
    return this._providers;
  }

  public set providers(v: Array<IOSPush | AndroidPush>) {
    this._providers = v;
  }

};
export interface IOSPush {
  type: string;
  certificateFile: string;
  passphrase: string;
};

export interface AndroidPush {
  type: string;
  apiKey: string;
};

/**
 * PushCollection
 */
export class PushCollection implements PushInterface {
  public pushRootFolder = `${process.cwd()}/push`;
  private _pushFiles: Array<{ name: string, path: string }> = [];
  private _providers: Array<IOSPush | AndroidPush> = [];
  private _pushConfigs: string;
  private _fileApi = new FileApi();

  constructor() {
    if (RxFs.exist(this.pushRootFolder)) {
      this._fileApi.fileList(this.pushRootFolder, '.hjson').zip(
        (files: Array<string>) => {
          console.log('files', files);
        }
      );
    }
  }

  addProvider(provider: IOSPush | AndroidPush, name: string) {
    this._providers.push(provider);
  }

  public get providers(): Array<IOSPush | AndroidPush> {
    return this._providers;
  }

  public set providers(v: Array<IOSPush | AndroidPush>) {
    this._providers = v;
  }

  public get pushConfigs(): string {
    return this._pushConfigs;
  }

  public set pushConfigs(v: string) {
    this._pushConfigs = v;
  }

  public get pushFiles(): Array<{ name: string, path: string }> {
    return this._pushFiles;
  }

  public set pushFiles(v: Array<{ name: string, path: string }>) {
    this._pushFiles = v;
  }
}
