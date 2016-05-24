import {Command} from './../utility/Command';
import * as chalk from 'chalk';
import {find, findIndex, sortBy} from 'lodash';
import {Observable, Observer} from '@reactivex/rxjs';
import {ServerModelRc, ServerModel} from './../models/ServerModelRc';
import * as Relution from 'relution-sdk';
import {FileApi} from './../utility/FileApi';
import {RxFs} from './../utility/RxFs';
import {Archiver} from './../utility/Archiver';
const figures = require('figures');
import * as path from 'path';

const loader = require('cli-loader')();
/**
 * create a new Baas for the Developer
 */
export class Deploy extends Command {
  constructor() {
    super('deploy');
  }
  private _deployServer: ServerModel;
  private _promptkey: string = 'deployserver';
  private _defaultServer: string = 'default';
  private _archiver: Archiver = new Archiver();
  private _relutionHjson: any;
  private _projectDir: string;
  private _fileApi: FileApi = new FileApi();

  public commands: any = {
    deploy: {
      description: this.i18n.DEPLOY,
      vars: {
        name: {
          pos: 0
        }
      }
    },
    help: {
      description: this.i18n.LIST_COMMAND('Deploy')
    },
    quit: {
      description: this.i18n.EXIT_TO_HOME
    }
  };

  /**
   * login on Relution
   * @link [relution-sdk](https://github.com/relution-io/relution-sdk)
   */
  login(choosedServer: ServerModelRc) {
     Relution.init({
      serverUrl: choosedServer.serverUrl,
      application: 'studio'
    });
    let currentUser = Relution.security.getCurrentUser();
    if (currentUser) {
      //this.log.info('Relution.security.getCurrentUser()', currentUser);
      return Observable.create((observer:any) => {
        observer.next({user: currentUser});
        observer.complete();
      })
    }

    //this.log.info('Relution', JSON.stringify(Relution.security, null, 2))
    let credentials = {
      userName: choosedServer.userName,
      password: choosedServer.password
    };

    return Observable.fromPromise(Relution.web.login(credentials));
  }
  /**
   * choose first on which Server the App has to be deployed
   */
  getServerPrompt(): Observable<any> {
    this._defaultServer = 'default';
    let prompt = this._copy(this._parent.staticCommands.server.crudHelper.serverListPrompt(this._promptkey, 'list', 'Select a Server'));
    let indexDefault: number = findIndex(this.userRc.config.server, { default: true });
    if (indexDefault > -1) {
      this._defaultServer += ` ${prompt[0].choices[indexDefault]}`
      prompt[0].choices.splice(indexDefault, 1);
      prompt[0].choices.unshift(this._defaultServer);
    }
    return Observable.fromPromise(this.inquirer.prompt(prompt));
  }

  /**
   * Get the organisation and test if it has defaultRoles. If not raise an error. If an application is generated by a user in a group that has no defaultRoles the application
   * doesn't work as expected.
   */
  checkOrga(resp: any) {
    let orga: any = Relution.security.getCurrentOrganization('defaultRoles');
    return orga && orga.defaultRoles.length > 0;
  }
  /**
   * upload the generated zip to the server
   */
  upload(archiveresp: any, env: string): Observable<any> {
    let formData = {
      // Pass a simple key-value pair
      env: env,
      name: this._relutionHjson.name,
      uuid: this._relutionHjson.uuid,
      // Pass optional meta-data with an 'options' object with style: {value: DATA, options: OPTIONS}
      // Use case: for some types of streams, you'll need to provide "file"-related information manually.
      // See the `form-data` README for more information about options: https://github.com/form-data/form-data
      custom_file: {
        value: archiveresp.readStream,
        options: {
          filename: path.basename(archiveresp.zip),
          contentType: 'application/zip'
        }
      }
    };
    return Observable.fromPromise(
      Relution.web.ajax({
        url: 'upload',
        headers: {
          "Accept": "text/plain"
        },
        method: 'POST',
        formData: formData,
        responseCallback: (resp:Q.Promise<any>) => {
          return resp.then(
            (r:any) => {
              r.pipe(process.stdout, { 'end': false });
              return r;
          });
        }
      })
    );
  }


  /**
   * deploy the baas to the server
   */
  public deploy(): Observable<any> {


    this._fileApi.path = this.projectDir;
    //loginresponse
    let resp: any = null;
    //choosed environment
    let envName: string = '';
    //choosed Server
    let choosedServer: any;

    return Observable.create(
      (observer: any) => {
        if (!RxFs.exist(path.join(process.cwd(), 'relution.hjson')) || !RxFs.exist(path.join(process.cwd(), '.relutionignore'))) {
          observer.error(`${process.cwd()} i not a valid Relution Project`);
          return observer.complete();
        }
        this._fileApi.readHjson(path.join(this.projectDir, 'relution.hjson')).subscribe(
          (relutionHjson: any) => {
            this.relutionHjson = relutionHjson.data;
          },
          (e: Error) => {
            observer.error(e);
            return observer.complete();
          },
          () => {
          /**
           * please choose a server
           */
            this.getServerPrompt().subscribe(
              (answers: any) => {
                choosedServer = answers[this._promptkey];
                /**
                 * Take me out of here
                 */
                //this.log.info('choosedServer === this.i18n.TAKE_ME_OUT', choosedServer === this.i18n.TAKE_ME_OUT);
              },
              () => {},
              () => {
                if (choosedServer === this.i18n.TAKE_ME_OUT) {

                  observer.complete()
                  return observer.complete();
                }
                /**
                 * get default server
                 */
                if (choosedServer === this._defaultServer) {
                  //this.log.info(this.userRc.config.server);
                  choosedServer = find(this.userRc.config.server, { default: true });
                }

                /**
                 * login on server
                 */
                this.login(choosedServer).subscribe(
                  (answer: any) => {
                    resp = answer;
                  },
                  (e: Error) => {
                    console.error(e.message, e);
                    observer.error(e);
                    return observer.complete();
                  },
                  () => {
                    //user is wrong
                    if (!this.checkOrga(resp)) {
                      console.error(chalk.red(`Organization has no defaultRoles. This will cause problems creating applications. Operation not permitted.`));
                      return observer.complete();
                    }
                    this.log.info(chalk.green(`logged in as ${resp.user.givenName ? resp.user.givenName + ' ' + resp.user.surname : resp.user.name}`));
                    /**
                     * get environment
                     */
                    this._parent.staticCommands.env.chooseEnv.choose('list').subscribe(
                      (answers: any) => {
                        envName = answers[this._parent.staticCommands.env.chooseEnv.promptName];
                      },
                      (e: Error) => {
                        observer.error(e);
                      },
                      () => {
                        if (envName === this.i18n.TAKE_ME_OUT) {
                          return observer.complete();
                        }
                        //create a zip and get stream
                        this._archiver.createBundle().subscribe(
                          (log: any) => {
                            if (log.file || log.directory) {
                              this.log.info(chalk.magenta(log.file ? `add file ${log.file}` : `add directory ${log.directory}`));
                            } else if (log.zip) {
                              /**
                               * {
                               *  zip: path:string,
                               *  message: string,
                               *  readStream: stream
                               * }
                               */
                              this.log.info(chalk.green(log.message) + ' ' + figures.tick);
                              loader.start();
                              this.upload(log, envName).subscribe(
                                (resp: XMLHttpRequest) => {
                                  loader.stop();
                                  observer.next(resp);
                                },
                                (e: Error) => {
                                  observer.error(e);
                                },
                                () => {
                                  this.log.info('Deployment close');
                                  observer.complete();
                                }
                              );
                            } else if (log.processed) {
                              this.log.info(chalk.green(log.processed) + ' ' + figures.tick);
                            } else {
                              observer.next(log);
                            }
                          }
                        );
                      }
                    );
                  }
                );
              }
            )
          }
        )
      }
    );
  }

  public get projectDir(): string {
    if (!this._projectDir) {
      this._projectDir = process.cwd();
    }
    return this._projectDir;
  }

  public set projectDir(v: string) {
    this._projectDir = v;
  }

  public get relutionHjson(): any {
    return this._relutionHjson;
  }

  public set relutionHjson(v: any) {
    this._relutionHjson = v;
  }
}
