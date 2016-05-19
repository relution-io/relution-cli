import {TemplateInterface} from './../../TemplateInterface';

export class EditorConfig implements TemplateInterface{
  public publishName: string = '.editorconfig';
  public name:string = 'editorconfig';
  public get template() : string {
    return (`
# http://editorconfig.org
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
    `);
  }

}
