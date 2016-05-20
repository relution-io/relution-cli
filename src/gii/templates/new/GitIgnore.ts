import {TemplateInterface} from './../../TemplateInterface';
const html = require('common-tags').html;
/**
 * create the RelutionHjson file for the Project
 */

export class GitIgnore implements TemplateInterface {

  public publishName: string = '.gitignore'
  public name: string = 'gitignore';

  get template() {
    return (html`
      node_modules
      npm-debug.log
    `);
  }
}
