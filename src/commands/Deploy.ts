import {Command} from './../utility/Command';
import * as chalk from 'chalk';
import {find, findIndex} from 'lodash';
import {Observable} from '@reactivex/rxjs';
import * as Relution from 'relution-sdk';
import {FileApi} from './../utility/FileApi';
import {RxFs} from './../utility/RxFs';
import {Archiver} from './../utility/Archiver';
const figures = require('figures');
import * as path from 'path';

const loader = require('cli-loader')();
/**
 * ```bash
 * ┌─────────┬──────────┬──────────┬────────────────────────────────┐
 * │ Options │ Commands │ Param(s) │ Description                    │
 * │         │          │          │                                │
 * │ deploy  │ deploy   │ <$name>  │ deploy your Baas to the server │
 * │ deploy  │ help     │ --       │ List the Deploy Command        │
 * │ deploy  │ back     │ --       │ Exit to Home                   │
 * │         │          │          │                                │
 * └─────────┴──────────┴──────────┴────────────────────────────────┘
 * ```
 * @todo remove zip file after deploy
 */
export class Deploy extends Command {
  constructor() {
    super('deploy');
  }
  private _promptkey: string = 'deployserver';
  private _defaultServer: string = 'default';
  private _archiver: Archiver = new Archiver();
  private _relutionHjson: any;
  private _projectDir: string;
  private _fileApi: FileApi = new FileApi();

  public commands: any = {
    publish: {
      description: this.i18n.DEPLOY_PUBLISH,
      when: () => {
        if (!RxFs.exist(path.join(process.cwd(), 'relution.hjson')) || this._parent.staticCommands.env.envCollection.collection.length <= 0 ) {
          return false;
        }
        return true;
      },
      why: () => {
        if (!RxFs.exist(path.join(process.cwd(), 'relution.hjson'))) {
          return this.i18n.FOLDER_IS_NOT_A_RELUTION_PROJECT(path.join(process.cwd()));
        }

        if (this._parent.staticCommands.env.envCollection.collection.length <= 0) {
          return this.i18n.ENV_ADD_FIRSTLY;
        }

      },
      vars: {
        name: {
          pos: 0
        }
      }
    },
    help: {
      description: this.i18n.HELP_COMMAND('Deploy')
    },
    back: {
      description: this.i18n.EXIT_TO_HOME
    }
  };

  /**
   * choose first on which Server the App has to be deployed
   */
  getServerPrompt(): Observable<any> {
    this._defaultServer = 'default';
    let prompt = this._copy(this._parent.staticCommands.server.crudHelper.serverListPrompt(this._promptkey, 'list', 'Select a Server'));
    let indexDefault: number = findIndex(this.userRc.server, { default: true });
    if (indexDefault > -1) {
      this._defaultServer += ` ${prompt[0].choices[indexDefault]}`;
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
    loader.start();

    // data to upload
    let formData = {
      // Pass a simple key-value pair
      env: env,
      name: this._relutionHjson.name,
      uuid: this._relutionHjson.uuid,
      // Pass optional meta-data with an 'options' object with style: {value: DATA, options: OPTIONS}
      // Use case: for some types of streams, you'll need to provide 'file'-related information manually.
      // See the `form-data` README for more information about options: https://github.com/form-data/form-data
      custom_file: {
        value: archiveresp.readStream,
        options: {
          filename: path.basename(archiveresp.zip),
          contentType: 'application/zip'
        }
      }
    };

    // continuously queries deployment status if server supports this
    let deploymentUrl: string;
    let deploymentCheck = (response: any): any => {
      if (!deploymentUrl) {
        return response;
      }

      let statusCode: number;
      return Relution.web.get({
        url: deploymentUrl,
        responseCallback: (resp: Relution.web.HttpResponse) => {
          statusCode = resp.statusCode;
          return resp;
        }
      }).then((body) => {
        if (statusCode === 202) {
          // deployment ongoing, repeat request
          Relution.debug.assert(!body);
          return deploymentCheck(response);
        }
        return response;
      }, (error: Relution.web.HttpError) => {
        if (error && error.statusCode === 404) {
          // relution server does not support deployment status query
          return response;
        }
        throw error;
      });
    };

    return Observable.fromPromise(
      Relution.web.ajax({
        url: 'upload',
        headers: {
          'Accept': 'text/plain'
        },
        method: 'POST',
        formData: formData,
        requestCallback: (request: Relution.web.HttpRequest) => {
          request.once('data', () => loader.stop());
          request.pipe(process.stdout, { 'end': false });
          return request;
        },
        responseCallback: (response: Relution.web.HttpResponse) => {
          deploymentUrl = response.headers['X-Relution-Studio-Deployment-Url'.toLowerCase()];
          return response;
        }
      })
      .finally(() => loader.start())
      .then(deploymentCheck)
      .finally(() => loader.stop())
      .then((result) => {
        this.log.info(this.i18n.DEPLOY_SUCCESS);

        // be nice and output URL of application
        const url = Relution.web.resolveApp(this._relutionHjson);
        if (url) {
          this.log.info(this.i18n.DEPLOY_APPURL, url);
        }
        return result;
      }, (error: Relution.web.HttpError) => {
        this.log.error(new Error(this.i18n.DEPLOY_FAILED));
        throw error;
      })
    );
  }

  /**
   * deploy the baas to the server
   */
  public publish(): Observable<any> {
    this._fileApi.path = this.projectDir;
    // loginresponse
    let userResp: Relution.security.User;
    // choosed environment
    let envName = '';
    // choosed Server
    let choosedServer: any;

    if (!RxFs.exist(path.join(process.cwd(), 'relution.hjson')) || !RxFs.exist(path.join(process.cwd(), '.relutionignore'))) {
      return Observable.throw(new Error(`${process.cwd()} is not a valid Relution Project`));
    }
    // load the environments before
    return this._parent.staticCommands.env.envCollection.getEnvironments()
      /**
       * load the relution.hjson
       */
      .exhaustMap(() => {
        return this._fileApi.readHjson(path.join(this.projectDir, 'relution.hjson'));
      })
      /**
       * get a server from inquirer
       */
      .exhaustMap((relutionHjson: { data: any, path: string }) => {
        this._relutionHjson = relutionHjson.data;
        return this.getServerPrompt()
          .filter((server: { deployserver: string }) => {
            return server.deployserver !== this.i18n.CANCEL;
          });
      })
      /**
       * logged in on server
       */
      .exhaustMap((server: { deployserver: string }) => {
        if (server.deployserver.toString().trim() === this._defaultServer.toString().trim()) {
          choosedServer = find(this.userRc.server, { default: true });
        } else {
          choosedServer = find(this.userRc.server, { id: server.deployserver });
        }
        loader.start();
        // console.log(choosedServer);
        return this.relutionSDK.login(choosedServer);
      })
      /**
       * choose environment
       */
      .exhaustMap((resp: any) => {
        userResp = resp.user;
        loader.stop();
        if (!this.checkOrga(userResp)) {
          return Observable.throw(new Error(this.i18n.DEPLOY_NO_ORGA));
        }
        this.log.info(chalk.green(`Login as ${userResp.givenName ? userResp.givenName + ' ' + userResp.surname : userResp.name} succeeded. ${figures.tick}`));
        // console.log(this._parent.staticCommands.env.chooseEnv);
        return this._parent.staticCommands.env.chooseEnv.choose('list')
          .filter((answers: { env: string }) => {
            return answers.env !== this.i18n.CANCEL;
          })
          /**
           * create the zip File
           */
          .map((answers: { env: string }) => {
            envName = answers[this._parent.staticCommands.env.chooseEnv.promptName];
            return this._archiver.createBundle();
          });
      })
      /**
       * loop into logs don when zip is coming upload start
       */
      .exhaustMap((log: Observable<{ file: string } | { directory: string } | { zip: string, readStream: any, message: string }>) => {
        return log.map((respLog: any) => {
          if (respLog.file || respLog.directory) {
            this.log.info(chalk.magenta(respLog.file ? `add file ${respLog.file}` : `add directory ${respLog.directory}`));
          } else if (respLog.processed) {
            this.log.info(chalk.green(respLog.processed) + ' ' + figures.tick);
          }
          return respLog;
        })
          .filter((respLog: { file: string } | { directory: string } | { zip: string, readStream: any, message: string }) => {
            return respLog['zip'];
          });
      })
      /**
       * upload zip to server
       */
      .exhaustMap((respLog: { zip: string, readStream: any, message: string }) => {
        this.log.info(chalk.green(respLog.message) + ' ' + figures.tick);
        return this.upload(respLog, envName);
      })
      /**
       * complete upload
       */
      .ignoreElements() // log piped already
      .finally(() => loader.stop());
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
