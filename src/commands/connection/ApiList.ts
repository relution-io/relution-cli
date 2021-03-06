import {Connection} from './../Connection';
import * as Relution from 'relution-sdk';
import {Observable} from '@reactivex/rxjs';
import * as path from 'path';
import {find, findIndex} from 'lodash';
import {Call, CallModel} from './../../models/CallModel';
import {ConnectionModel} from './../../models/ConnectionModel';
import {Gii} from './../../gii/Gii';
import {TreeDirectory} from './../Connection';
import {TsBeautifier} from './../../gii/TsBeautifier';

export class ApiList {

  private _callsCollection: CallModel[];
  /**
   * the default server
   */
  private _defaultServer: string;
  /**
   * template renderer
   */
  private _gii = new Gii();
  constructor(public connection: Connection) {}

  private _enterCallName(calls: CallModel[]): any {
    let prompt: Array<{type: string, name: string, value: CallModel, default: string, message: string}> = [];
    calls.forEach((call) => {
      prompt.push({
        type: 'input',
        name: call.name,
        message: this.connection.i18n.ENTER_SOMETHING.concat(`name for ${call.name}`),
        default: call.name,
        value: call
      });
    });
    return Observable.fromPromise(this.connection.inquirer.prompt(prompt));
  }

  private _filterCallsByName = function (call: Call): boolean {
    return call.name.indexOf(this) !== - 1;
  };

  private _pleaseFilterCalls(calls: CallModel[]) {
    let prompt: any = {
      type: 'input',
      message: `We found ${calls.length} ${calls.length === 1 ? `call` : `calls`} you can filter by Name ${this.connection.i18n.PRESS_ENTER} ?`,
      name: 'callsFilter'
    };
    return Observable.fromPromise(this.connection.inquirer.prompt(prompt));
  }



  private _chooseCalls(calls: CallModel[]): any | Array<{
        name: string,
        value: Call,
        short: string
      }>  {
    let choices = calls.map((call: CallModel) => {
      return {
        name: call.name,
        value: call,
        short: call.name.substr(0, 10)
      };
    });

    let prompt: any = {
      type: 'checkbox',
      message: `Please choose youre calls:`,
      name: 'choosedCalls',
      choices: choices,
      paginated: calls.length < 10 ? true : false,
      validate: (answer: string[]): boolean => {
        if (answer.length < 1) {
          this.connection.debuglog.warn(`You must choose at least one topping.`);
          return false;
        }
        return true;
      }
    };
    return Observable.fromPromise(this.connection.inquirer.prompt(prompt));
  }

  private _chooseConnection(): any | Observable<any> {
    let choices = this.connection.getConnectionNames();
    choices.push({name: this.connection.i18n.CANCEL, value: this.connection.i18n.CANCEL});

    return Observable.fromPromise(
      this.connection.inquirer.prompt({
        type: 'list',
        name: 'connectionname',
        message: this.connection.i18n.CHOOSE_LIST('Name'),
        choices: choices
      })
    );
  }

  apiList(name?: string) {
    let relutionHjson: any;
    let choosedServer: any;
    let calls: any;
    let connectionModel: ConnectionModel = new ConnectionModel();
    let choosedCalls: any;
    let treeDirectory: TreeDirectory;
     /**
     * get the server connection name
     */
    return this._chooseConnection()
      .filter((answers: { connectionname: TreeDirectory | string }) => {
        return answers.connectionname !== this.connection.i18n.CANCEL;
      })
      .exhaustMap((answers: { connectionname: TreeDirectory }) => {
        treeDirectory = answers.connectionname;
        return connectionModel.fromJson(treeDirectory.path);
      })
      /**
       * read the relution.hjson
       */
      .exhaustMap((newModel: ConnectionModel) => {
        connectionModel = newModel;
        return this.connection.fileApi.readHjson(path.join(process.cwd(), 'relution.hjson'));
      })
      /**
       * server choose
       */
      .exhaustMap((resp: { data: any, path: string }) => {
        relutionHjson = resp.data;
        return this.connection.helperAdd.getServerPrompt();
      })
      /**
       * login on relution
       */
      .exhaustMap((server: { connectserver: string }) => {
        this._defaultServer = this.connection.helperAdd.defaultServer;

        if (server.connectserver.toString().trim() === this._defaultServer.toString().trim()) {
          choosedServer = find(this.connection.userRc.server, { default: true });
        } else {
          choosedServer = find(this.connection.userRc.server, { id: server.connectserver });
        }
        return this.connection.relutionSDK.login(choosedServer)
          .filter((resp: { user: Relution.security.User }) => {
            return resp.user ? true : false;
          });
      })
      /**
       * get the connection uuid from the server
       */
      .exhaustMap((resp: { user: Relution.security.User }) => {
        return this.connection.getConnectionUUid(relutionHjson.uuid, connectionModel.name);
      })
      /**
       * read the calls from the server
       */
      .exhaustMap((resp: { empty: boolean, items: Array<{ uuid: string }> }) => {
        return this.connection.getConnectionCalls(resp.items[0].uuid);
      })
      /**
       * add the calls to the _callsCollection as a Model
       */
      .exhaustMap((callsResp: CallModel[]) => {
        this._callsCollection = [];
        // console.log(Object.keys(callsResp).length);
        Object.keys(callsResp).forEach((key: string) => {
          let params: Call = callsResp[key];
          let model: CallModel = new CallModel(params.connectionId, params.outputModel, params.name, params.inputModel, params.action);
          this._callsCollection.push(model);
        });
        /**
         * Prompt a Filter
         */
        // console.log(this._callsCollection);
        if (this._callsCollection.length >= 5) {
          return this._pleaseFilterCalls(this._callsCollection)
            .exhaustMap((answers: { callsFilter: string }) => {
              if (answers.callsFilter && answers.callsFilter.length > 0) {
                calls = this._callsCollection.filter(this._filterCallsByName, answers.callsFilter);
                return this._chooseCalls(calls);
              }
              return this._chooseCalls(this._callsCollection);
            });
        }
        return this._chooseCalls(this._callsCollection);
      })
      .exhaustMap((answers: { choosedCalls: Array<CallModel> }) => {
        choosedCalls = answers.choosedCalls;
        return this._enterCallName(choosedCalls);
      })
      .exhaustMap((answers: any) => {
        Object.keys(answers).forEach((key: string) => {
          let index = findIndex(choosedCalls, {name: key});
          choosedCalls[index].name = answers[key];
        });
        connectionModel.calls = connectionModel.getCallsForHjson(choosedCalls);
        return this.connection.fileApi.writeHjson(connectionModel.toJson(), treeDirectory.connection.name, path.dirname(treeDirectory.path));
      })
      /**
       * write name.gen.js file to the connections folder
       */
      .exhaustMap(() => {
        let template = this._gii.getTemplateByName('connectionGen');
        template.instance.name = connectionModel.name;
        template.instance.path = path.dirname(connectionModel.name);
        template.instance.metaData = choosedCalls;
        // console.log(template.instance);
        return this.connection.fileApi.writeFile(template.instance.template, `${template.instance.name}.gen.ts`, this.connection.rootFolder)
          .exhaustMap(() => {
            return TsBeautifier.format([path.join(this.connection.rootFolder, `${template.instance.name}.gen.ts`)]);
          });
      })
      .map(() => {
        const exec = require('child_process').exec;
        exec(`tsc -p ${process.cwd()}`);
      })
      .exhaustMap(() => {
        return this.connection._parent.staticCommands.project.deploy([choosedServer.id]);
      })
      .do({
        complete: () => {
          return this.connection.debuglog.info(`${connectionModel.name} are updated!`);
        }
      });
  }
};
