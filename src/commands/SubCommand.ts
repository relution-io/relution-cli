interface SubCommandInterface {
  name:string;
  vars?: [string];
}

export class SubCommand implements SubCommandInterface {

  public name:string;
  public vars:[string];

  constructor(name:string, vars?:[string]) {
    if (!name || !name.length) {
      throw new Error('Subcommand need a name');
    }
    this.name = name;

    if (vars) {
      this.vars = vars;
    }
  }
}
