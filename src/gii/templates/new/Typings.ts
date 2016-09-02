import {TemplateInterface} from './../../TemplateInterface';
const html = require('common-tags').html;

export class TypingsJson implements TemplateInterface {
  public publishName: string = 'typings.json';
  public name: string = '';
  public main: string = '';

  get template() {
    return (html`
      {
      "globalDependencies": {
        "body-parser": "registry:dt/body-parser#0.0.0+20160619023215",
        "es6-collections": "registry:dt/es6-collections#0.5.1+20160316155526",
        "es6-promise": "registry:dt/es6-promise#0.0.0+20160614011821",
        "express": "registry:dt/express#4.0.0+20160708185218",
        "express-serve-static-core": "registry:dt/express-serve-static-core#4.0.0+20160819131900",
        "multer": "registry:dt/multer#0.0.0+20160818200730",
        "node": "registry:dt/node#6.0.0+20160818175514",
        "q": "registry:dt/q#0.0.0+20160613154756",
        "serve-static": "registry:dt/serve-static#0.0.0+20160606155157"
      },
      "dependencies": {
        "lodash": "registry:npm/lodash#4.0.0+20160723033700",
        "mime": "registry:npm/mime#1.3.0+20160723033700"
      }
    }
    \n
    `);
  }
}
