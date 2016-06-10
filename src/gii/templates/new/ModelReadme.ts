import {TemplateInterface} from './../../TemplateInterface';
import {PackageJson} from './PackageJson';
const html = require('common-tags').html;

export class ModelReadme implements TemplateInterface {
  public name: string = 'modelreadme';
  public parentFolder: string = 'models';
  public publishName: string = 'README.md';
  public package: PackageJson = new PackageJson();
  public description: string = `
    This folder contains model definitions of the data managed by the backend application.
    \`\`\`bash
      relution model help
    \`\`\``;

  get template(){
    return (html`
      ${this.description}
    `);
  }
}
