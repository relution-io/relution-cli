const Hjson = require('hjson');
export class EnvironmentTemplate {
  public name:string = '';
  /**
   *   Hjson.parse(text, options)

      options {
        keepWsc     boolean, keep white space and comments. This is useful
                    if you want to edit an hjson file and save it while
                    preserving comments (default false)
      }

      This method parses Hjson text to produce an object or array.
      It can throw a SyntaxError exception.


    Hjson.stringify(value, options)

   */
  get template():string {
    return Hjson.parse(`
{
  //all vars are usable in your hjson files
  name: ${this.name}
}`,{keepWsc: true});
  }

  public render(name:string){
    this.name = name;
    console.log(this.template)
    return this.template;
  }
}
