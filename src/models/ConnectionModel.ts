export interface ConnectionInterface {
  name: string;
  description: string;
  type: string;
  connectorProvider: string;
  properties: any;
  calls: any;
};

export class ConnectionModel implements ConnectionInterface {

  private _name: string = '';
  private _type: string = '';
  private _connectorProvider: string = '';
  private _description: string = 'Auto Generated';
  private _properties: any = {};
  private _calls: any = {};

  constructor(params?: { name?: string, type?: string, calls?: {}, properties?: {} }) {
    if (params) {
      Object.keys(params).forEach((key) => {
        this[key] = params[key];
      });
    }
  }

  public get calls(): {} {
    return this._calls;
  }

  public set calls(v: {}) {
    this._calls = v;
  }

  public get name(): string {
    return this._name;
  }

  public set name(v: string) {
    this._name = v;
  }

  public get type(): string {
    return this._type;
  }

  public set type(v: string) {
    this._type = v;
  }

  public get description(): string {
    return this._description;
  }

  public set description(v: string) {
    this._description = v;
  }

  public get properties(): {} {
    return this._properties;
  }

  public set properties(v: {}) {
    this._properties = v;
  }

  public get connectorProvider(): string {
    return this._connectorProvider;
  }

  public set connectorProvider(v: string) {
    this._connectorProvider = v;
  }

  public toJson(): string {
    return JSON.stringify({
      name: this.name,
      connectorProvider: this.connectorProvider,
      description: this.description,
      type: this.type,
      calls: this.calls || {},
      properties: this.properties || {}
    }, null, 2);
  }
}
