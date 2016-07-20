import {TemplateInterface} from './../../TemplateInterface';
const html = require('common-tags').html;

/**
 * create the RelutionHjson file for the Project
 */
export class RelutionIgnore implements TemplateInterface {

  public publishName: string = '.relutionignore';
  public name: string = 'relutionignore';

  get template() {
    return (html`
      client/**/*.*
      /node_modules
      typings
      **/*.ts
      .DS_STORE
    `);
  }
}
