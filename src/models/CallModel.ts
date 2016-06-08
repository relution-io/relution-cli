export interface Call {
  connectionId: string;
  name: string;
  inputModel: string;
  outputModel: string;
  action: any;
}

export class CallModel implements Call {
  constructor(
    public connectionId: string,
    public outputModel: string,
    public name: string,
    public inputModel: string,
    public action: any
  ) { }
}
