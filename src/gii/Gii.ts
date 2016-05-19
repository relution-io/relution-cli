/**
 * @class Gii
 * Gii provides a CLI-based interface for you to interactively generate the code you want.
 */
import {findIndex} from 'lodash';
import {EnvironmentTemplate} from './templates/EnvironmentTemplate';
import {App as AppTemplate} from './templates/new/App';
import {RelutionHjson as RelutionHjsonTemplate} from './templates/new/RelutionHjson';
import {RelutionIgnore as RelutionIgnoreTemplate} from './templates/new/RelutionIgnore';
import {PackageJson as PackageJsonTemplate} from './templates/new/PackageJson';
import {Routes as RoutesTemplate} from './templates/new/Routes';
import {EditorConfig as EditorConfigTemplate} from './templates/new/EditorConfig';
import {Readme as ReadmeTemplate} from './templates/new/Readme';

import {TemplateModel} from './TemplateModel';

export class Gii {

  public templatesFolder: string = `./templates/`;

  /**
   * available Templates
   * ```javascript
   * let gii:Gii = new Gii();
   * let env:TemplateModel = gii.getTemplateByName('env');
   * env.instance.name = 'prod';
   * console.log(env.instance.template);
   * ```
   */

  public templates: Array<TemplateModel> = [
    new TemplateModel('env', new EnvironmentTemplate()),
    new TemplateModel('app', new AppTemplate()),
    new TemplateModel('relutionhjson', new RelutionHjsonTemplate()),
    new TemplateModel('relutionignore', new RelutionIgnoreTemplate()),
    new TemplateModel('package', new PackageJsonTemplate()),
    new TemplateModel('routes', new RoutesTemplate()),
    new TemplateModel('editorconfig', new EditorConfigTemplate()),
    new TemplateModel('readme', new ReadmeTemplate())
  ];

  public getTemplateByName(name:string) : TemplateModel {
    let templateIndex:number = findIndex(this.templates, {name: name});
    if (templateIndex < 0) {
      return undefined;
    }
    return this.templates[templateIndex];
  }
}

