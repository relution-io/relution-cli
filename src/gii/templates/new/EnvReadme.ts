import {TemplateInterface} from './../../TemplateInterface';
const html = require('common-tags').html;

export class EnvReadme implements TemplateInterface {
  public name: string = 'envreadme';
  public parentFolder: string = 'env';
  public publishName: string = 'README.md';
  public description: string = `
    This folder contains configuration data of different deployment environments.
    \`\`\`bash
      relution env help
    \`\`\``;

  get template() {
    return (html`
      ${this.description}
    `);
  }
}
