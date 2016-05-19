import {TemplateInterface} from './../../TemplateInterface';
/**
 * create the RelutionHjson file for the Project
 */

export class RelutionIgnore implements TemplateInterface {

  public publishName: string = '.relutionignore'
  public name: string = 'relutionignore';

  get template() {
    return (
      `
client/**/*.*
/node_modules
`
    ).trim();
  }
}
