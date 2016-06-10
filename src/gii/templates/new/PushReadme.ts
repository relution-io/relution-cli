import {TemplateInterface} from './../../TemplateInterface';
const html = require('common-tags').html;

export class PushReadme implements TemplateInterface {
  public name: string = 'pushreadme';
  public parentFolder: string = 'push';
  public publishName: string = 'README.md';
  public description: string = `
    This folder contains push service metadata used by the backend application.
    \`\`\`bash
      relution push help
    \`\`\``;

  get template(){
    return (html`
      ${this.description}
    `);
  }
}
