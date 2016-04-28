interface SubCommandInterface {
  name:string;
  vars?: [string];
}

export class SubCommand implements SubCommandInterface {
  constructor(name:string, vars?:[string]) {
    this.name = name;
    if (vars) {
      this.vars = vars;
    }
  }
  public set name(v: string) {
    this.name = v;
  };

  public get name() : string {
    return this.name;
  };


  public get vars() : [string] {
    return this.vars;
  }

  public set vars(v : [string]) {
    this.vars = v;
  }
}
