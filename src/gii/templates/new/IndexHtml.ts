import {TemplateInterface} from './../../TemplateInterface';
import {PackageJson} from './PackageJson';
const html = require('common-tags').html;

export class IndexHtml implements TemplateInterface {
  public name: string = 'index.html';
  public parentFolder: string = 'www';
  public publishName: string = 'index.html';
  public package: PackageJson = new PackageJson();

  get template() {
    return (html`
      <html>
        <head>
          <meta charset="utf-8">
          <title>${this.name}</title>
        </head>
        <body>
          <h1>${this.name}</h1>
          <p>
            ${this.package.description}
          </p>
        </body>
      </script>
    `);
  }
}
