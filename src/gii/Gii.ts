
/**
 * @class Gii
 * Gii provides a CLI-based interface for you to interactively generate the code you want.
 */
import {findIndex} from 'lodash';

import {EnvironmentTemplate} from './templates/EnvironmentTemplate';
import {App as AppTemplate} from './templates/new/App';
import {RelutionHjson as RelutionHjsonTemplate} from './templates/new/RelutionHjson';
import {RelutionIgnore as RelutionIgnoreTemplate} from './templates/new/RelutionIgnore';
import {GitIgnore as GitIgnoreTemplate} from './templates/new/GitIgnore';
import {PackageJson as PackageJsonTemplate} from './templates/new/PackageJson';
import {Routes as RoutesTemplate} from './templates/new/Routes';
import {EditorConfig as EditorConfigTemplate} from './templates/new/EditorConfig';
import {IndexHtml} from './templates/new/IndexHtml';
import {Readme as ReadmeTemplate} from './templates/new/Readme';
import {PushReadme as PushReadmeTemplate} from './templates/new/PushReadme';
import {PushRoute as PushRouteTemplate} from './templates/new/PushRoute';
import {EnvReadme as EnvReadmeTemplate} from './templates/new/EnvReadme';
import {ConnectionsReadme as ConnectionsReadmeTemplate} from './templates/new/ConnectionsReadme';
import {ModelReadme as ModelReadmeTemplate} from './templates/new/ModelReadme';
import {Connectors as ConnectorsTemplate} from './templates/new/Connectors';
import {TslintJson as TslintJsonTemplate} from './templates/new/TslintJson';
import {TsConfigJson as TsConfigJsonTemplate} from './templates/new/TsConfigJson';
import {Connection as ConnectionTemplate} from './templates/connection/Connection';
import {ConnectionGen as ConnectionGenTemplate} from './templates/connection/ConnectionGen';
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
    new TemplateModel('gitignore', new GitIgnoreTemplate()),
    new TemplateModel('package', new PackageJsonTemplate()),
    new TemplateModel('routes', new RoutesTemplate()),
    new TemplateModel('editorconfig', new EditorConfigTemplate()),
    new TemplateModel('index.html', new IndexHtml()),
    new TemplateModel('readme', new ReadmeTemplate()),
    new TemplateModel('pushreadme', new PushReadmeTemplate()),
    new TemplateModel('envreadme', new EnvReadmeTemplate()),
    new TemplateModel('modelreadme', new ModelReadmeTemplate()),
    new TemplateModel('connectionsreadme', new ConnectionsReadmeTemplate()),
    new TemplateModel('connectors', new ConnectorsTemplate()),
    new TemplateModel('connection', new ConnectionTemplate()),
    new TemplateModel('connectionGen', new ConnectionGenTemplate()),
    new TemplateModel('pushroute', new PushRouteTemplate()),
    new TemplateModel('tslint', new TslintJsonTemplate()),
    new TemplateModel('tsconfig', new TsConfigJsonTemplate())
  ];

  public getTemplateByName(name: string): TemplateModel {
    let templateIndex: number = findIndex(this.templates, { name: name });
    if (templateIndex < 0) {
      return undefined;
    }
    return this.templates[templateIndex];
  }
}

