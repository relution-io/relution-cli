import {TemplateInterface} from './../../TemplateInterface';
const html = require('common-tags').html;

export class TsConfigJson implements TemplateInterface {
  public publishName: string = 'tsconfig.json';
  public name: string = 'tsconfig';

  get template() {
    return (html`
      {
        "compilerOptions": {
          "target": "ES5",
          "module": "commonjs",
          "declaration": false,
          "sourceMap": true,
          "rootDir": "./",
          "outDir": "./",
          "pretty": true,
          "stripInternal": true,
          "noEmitOnError": true,
          "noImplicitAny": false,
          "suppressImplicitAnyIndexErrors": true,
          "noFallthroughCasesInSwitch": true,
          "noImplicitReturns": false,
          "forceConsistentCasingInFileNames": true,
          "newLine": "lf"
        },
        "filesGlob": [
          "**/!(*.d).ts",
          "!node_modules/**/*.d.ts",
          "!node_modules/**/*.ts",
          "typings/index.d.ts"
        ]
      }\n
    `);
  }
}
