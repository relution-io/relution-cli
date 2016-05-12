import {Command} from './../utility/Command';
import {Observable} from '@reactivex/rxjs';
import {Validator} from './../utility/Validator';
import {Translation} from './../utility/Translation';
import {EnvCollection} from './../collection/EnvCollection';
import {FileApi} from './../utility/FileApi';
import {Gii} from './../gii/Gii';
/**
 * create a autogenerated environment for the developer
 * This is a key => value Store for your server project.
 * ```bash
 *  relution env <$name>
 * ```
 */
/**
 * Environment
 */
export class Environment extends Command {
  /**
   * available commands
   */
  public commands: Object = {
    add: {
      description: 'add a new Environment',
      vars: {
        name: {
          pos: 0
        }
      }
    },
    copy: {
      description: 'copy a exist Environment',
      vars: {
        from: {
          pos: 0
        },
        name:{
          pos: 1
        }
      }
    },
    help: {
      description: 'List the Server Command'
    },
    quit: {
      description: 'Exit To Home'
    }
  };
  /**
   * hjson file helper
   */
  public fsApi: FileApi = new FileApi();
  public gii:Gii = new Gii();
  public envFiles:Array<string> = [];
  public envCollection:EnvCollection = new EnvCollection();

  constructor() {
    super('env');
  }
  /**
   * write the hjson to the dev folder
   * @todo add process.cwd as path
   */
  createEnvironment(name:string) {
    return Observable.create((observer:any) => {
      let template = this.gii.getTemplateByName(this.name);
      this.fsApi.writeHjson(template.instance.render(name), name).subscribe(
        (pipe:any) => {
          observer.next(pipe);
        },
        (e:any) => {observer.error(e)},
        () => {observer.complete()}
      );
    });
  }

  /**
   * overwrite Commnad preload and load environments before
   */
  preload () {
    return this.envCollection.getEnvironments().subscribe({complete: ( ) => {
      // console.log(this.collection.collection);
      return super.preload();
    }});
  }

  /**
   * add a name for a new environment
   */
  get _addName(): Array<Object> {
    let self = this;
    return [
      {
        type: 'input',
        name: 'name',
        message: Translation.ENTER_SOMETHING.concat('Environment name'),
        validate: function(value: string) {
          let done:any =  this.async();
          if (self.envCollection.isUnique(value)) {
              console.log(`\n Name ${value} already exist please choose another one`);
              done(false);
          }

          let pass = value.match(Validator.stringPattern);
          if (pass) {

            done(null, true);
          } else {
            console.log(`\n Name ${value} has wrong character allowed only [a-z A-Z]`);
            done(false);
          }
        }
      }
    ];
  }

  enterName() {
    let prompt = this._addName;
    return Observable.fromPromise(this.inquirer.prompt(prompt));
  }

  /**
   * add a new Environment allow attributes name as a string
   */
  add(name?: string) {
    if (!name || !name.length) {
      return Observable.create((observer: any) => {
        this.enterName().subscribe(
          (answers: any) => {
            this.createEnvironment(answers.name).subscribe({
              complete: () => observer.complete()
            });
          },
          (e: any) => console.error(e),
          () => {observer.complete();}
        );
      });
    }

    if (name[0].match(Validator.stringPattern)) {
      return Observable.create((observer:any) => {
        this.createEnvironment(name[0]).subscribe(
          () => {observer.next()},
          (e: any) => {observer.error(e)},
          () => {observer.complete();}
        );
      });
    }

    Observable.throw('Your name is not valid');
  }
}
