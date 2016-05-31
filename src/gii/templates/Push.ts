import {TemplateInterface} from './../TemplateInterface';
import {AndroidPush, IOSPush} from './../../collection/PushCollection';
const html = require('common-tags').html;

/**
 * Push
 */
export class Push implements TemplateInterface {
  public publishName: string;
  /**
   * filename
   */
  public name: string = '';
  /**
   * model to render
   */
  public model: IOSPush | AndroidPush;
  /**
   * available ios|android
   */
  private _type: string;

  get template() {
    return (html`${JSON.stringify(this.model, null, 2)}`);
  }

  public get type(): string {
    return this._type;
  }

  public set type(v: string) {
    this._type = v;
  }
}
