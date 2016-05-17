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
import {TemplateModel} from './TemplateModel';

export class Gii {

  public templatesFolder: string = `./templates/`;

  public templates: Array<TemplateModel> = [
    new TemplateModel('env', new EnvironmentTemplate()),
    new TemplateModel('app', new AppTemplate()),
    new TemplateModel('relutionhjson', new RelutionHjsonTemplate()),
    new TemplateModel('relutionignore', new RelutionIgnoreTemplate()),
    new TemplateModel('package', new PackageJsonTemplate())
  ];

  public getTemplateByName(name:string) : TemplateModel {
    let templateIndex:number = findIndex(this.templates, {name: name});
    if (templateIndex < 0) {
      return undefined;
    }
    return this.templates[templateIndex];
  }
}

