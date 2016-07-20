import {TemplateInterface} from './../../TemplateInterface';
const html = require('common-tags').html;

export class TslintJson implements TemplateInterface {
  public publishName: string = 'tslint.json';
  public name: string = 'tslint';

  get template() {
    return (html`
     {
        "rules": {
          "max-line-length": [false, 200],
          "no-inferrable-types": true,
          "class-name": true,
          "comment-format": [
            true,
            "check-space"
          ],
          "indent": [
            true,
            "spaces"
          ],
          "eofline": true,
          "no-duplicate-variable": true,
          "no-eval": true,
          "no-arg": true,
          "no-internal-module": true,
          "no-trailing-whitespace": true,
          "no-bitwise": true,
          "no-shadowed-variable": true,
          "no-unused-expression": true,
          "no-unused-variable": true,
          "one-line": [
            true,
            "check-catch",
            "check-else",
            "check-open-brace",
            "check-whitespace"
          ],
          "quotemark": [
            true,
            "single",
            "avoid-escape"
          ],
          "semicolon": [true, "always"],
          "typedef-whitespace": [
            true,
            {
              "call-signature": "nospace",
              "index-signature": "nospace",
              "parameter": "nospace",
              "property-declaration": "nospace",
              "variable-declaration": "nospace"
            }
          ],
          "curly": true,
          "variable-name": [
            true,
            "ban-keywords",
            "check-format",
            "allow-leading-underscore",
            "allow-trailing-underscore"
          ],
          "whitespace": [
            true,
            "check-branch",
            "check-decl",
            "check-operator",
            "check-separator",
            "check-type"
          ]
        }
      }\n
    `);
  }
}
