import {TemplateInterface} from './../../TemplateInterface';
const html = require('common-tags').html;

export class ConnectionsReadme implements TemplateInterface {
  public name: string = 'connectionsreadme';
  public parentFolder: string = 'connections';
  public publishName: string = 'README.md';
  public description: string = `
    This folder contains definitions of the 3rd-tier backend servers used by the application.
    \`\`\`bash
      relution connections help
    \`\`\``;

  get template(){
    return (html`
      ${this.description}
    `);
  }
}
