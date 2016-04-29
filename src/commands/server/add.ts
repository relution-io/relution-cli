import {Validator} from './../../utility/Validator';
import {ServerModelRc} from './../../utility/ServerModelRc';
/**
 *
 */
export class Add {
  public model:ServerModelRc;
  public config: Array<Object> = [
    {
      type: 'input',
      name: 'name',
      message: 'Server Name',
      validate: (value: string): any => {
        var pass = value.match(Validator.stringNumberPattern);
        if (pass) {
          return true;
        } else {
          return 'Please enter a valid Server name';
        }
      }
    },
    {
      type: 'input',
      name: 'baseUrl',
      message: 'Enter the server url (http://....)',
      validate: (value: string): any => {
        var pass = value.match(Validator.urlPattern);

        if (pass) {
          return true;
        } else {
          return 'Please enter a valid url';
        }
      }
    },
    {
      type: 'input',
      name: 'username',
      message: 'Enter your username',
      validate: Validator.notEmptyValidate('Username')
    },
    {
      type: 'password',
      name: 'password',
      message: 'Enter your Password',
      validate: Validator.notEmptyValidate('Password')
    }
  ];

  public pushInqu: Array<Object> = [];

  constructor(params:Object = {name: '', baseUrl: '', username: '', password: ''}, cli : boolean = true) {
    this.model = new ServerModelRc();
    //Object.assign(this.model, params);
  }

  // withName(name) {
  //   return inquirer
  // }

  // add(args: Array<string>){
  //   if (args.name) {
  //     this.withName(args.name);
  //   }
  // }
}
