import {Validator} from './Validator';

interface ObjectCtor extends ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
}
declare var Object: ObjectCtor;
export let assign = Object.assign ? Object.assign : function(target: any, ...sources: any[]): any {
        return;
};

export class ServerModelRc {

  public name: string;
  public baseUrl: string;
  public username: string;
  public pasword: string;
  public errors: Array<Object>;

  public rules:Object =  {
    name: Validator.notEmptyValidate,
    baseUrl: Validator.url,
    username: Validator.notEmptyValidate,
    password: Validator.notEmptyValidate,
  };

  constructor(params?: Object) {
    if (params){
      Object.assign(params, this);
    }
  }

  validate(){
    this.errors = [];
    Object.keys(this.rules).forEach((param) => {
      if ( !this.rules[param](this[param]) ){
        this.errors.push({name: param});
      }
    });
    return this.errors.length > 0;
  }

  withName(name:string) {
    return
  }
}
