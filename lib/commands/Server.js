"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var rxjs_1 = require('@reactivex/rxjs');
var Command_1 = require('./../utility/Command');
var Validator_1 = require('./../utility/Validator');
var ServerCrud_1 = require('./server/ServerCrud');
var lodash_1 = require('lodash');
var PRESS_ENTER = ' or press enter';
var Server = (function (_super) {
    __extends(Server, _super);
    function Server() {
        _super.call(this, 'server');
        this.tableHeader = ['Name', 'Server url', 'Default', 'Username'];
        this.debug = true;
        this.commands = {
            add: {
                description: 'add a new BaaS Server',
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            list: {
                description: 'list all available BaaS Server',
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            update: {
                description: 'update a exist server from the Server list',
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            rm: {
                description: 'remove a server form the list',
                vars: {
                    name: {
                        pos: 0
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
    }
    Server.prototype.preload = function () {
        var _this = this;
        return this.userRc.rcFileExist().subscribe(function (exist) {
            if (exist) {
                return _this.userRc.streamRc().subscribe(function (data) {
                    _this.config = data;
                });
            }
        }, function (e) {
            console.error(e);
        }, function () {
            _this.crudHelper = new ServerCrud_1.ServerCrud(_this.userRc);
        });
    };
    Object.defineProperty(Server.prototype, "addConfig", {
        get: function () {
            return [
                {
                    type: 'input',
                    name: 'id',
                    message: 'Server Name',
                    validate: function (value) {
                        var pass = value.match(Validator_1.Validator.stringNumberPattern);
                        if (pass) {
                            return true;
                        }
                        else {
                            return 'Please enter a valid Server name';
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'serverUrl',
                    message: 'Enter the server url (http://....)',
                    validate: function (value) {
                        var pass = value.match(Validator_1.Validator.urlPattern);
                        if (pass) {
                            return true;
                        }
                        else {
                            return 'Please enter a valid url';
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'userName',
                    message: 'Enter your username',
                    validate: function (value) {
                        return Validator_1.Validator.notEmptyValidate(value);
                    }
                },
                {
                    type: 'password',
                    name: 'password',
                    message: 'Enter your Password',
                    validate: function (value) {
                        return Validator_1.Validator.notEmptyValidate(value);
                    }
                },
                {
                    type: 'confirm',
                    name: 'default',
                    default: false,
                    message: 'Set as Default Server ?'
                }
            ];
        },
        enumerable: true,
        configurable: true
    });
    Server.prototype.list = function (name) {
        var _this = this;
        var empty = ['', '', '', ''];
        var content = [empty];
        var _parts = lodash_1.partition(this.userRc.server, function (server) {
            return server.default;
        });
        if (_parts[1]) {
            _parts[1] = lodash_1.orderBy(_parts[1], ['id'], ['asc']);
        }
        var _list = lodash_1.concat(_parts[0], _parts[1]);
        _list.forEach(function (model) {
            content.push(model.toTableRow(), empty);
        });
        return rxjs_1.Observable.create(function (observer) {
            observer.next(_this.table.sidebar(_this.tableHeader, content));
            observer.complete();
        });
    };
    // updateServerChooserPrompt(id?: string) {
    //   let prompt: any = this.serverListPrompt('server', 'list', 'choose a Server');
    //   console.log('prompt', prompt);
    //   if (id && id.length) {
    //     prompt.default = () => { return id; }
    //   }
    //   return Observable.fromPromise(this.inquirer.prompt(prompt));
    // }
    // updateServer(prompt:any, oldServerId:string){
    //   return Observable.fromPromise(this.inquirer.prompt(prompt)).subscribe(
    //     (answers:any) => {
    //       let serverIndex:number = findIndex(this.userRc.config.server, {id: oldServerId});
    //       this.userRc.config.server[serverIndex] = answers;
    //       return this.userRc.updateRcFile().subscribe(
    //         () => {
    //           console.log(`${oldServerId} are updated`);
    //         },
    //         (e:Error) => {
    //         },
    //         () => {
    //           return this.init(['server'], this._parent);
    //         }
    //       );
    //     }
    //   );
    // }
    // updateWithoutId(){
    //   let serverId: string;
    //   return this.updateServerChooserPrompt().subscribe(
    //     (answers: any) => {
    //       if (answers.server === this.takeMeOut) {
    //         return this.init(['server'], this._parent);
    //       }
    //       serverId = this._copy(answers.server);
    //       let serverIndex:number = findIndex(this.userRc.config.server, {id: serverId});
    //       let defaults:any = this.userRc.config.server[serverIndex];
    //       console.log(serverIndex, defaults);
    //       let prompt:any = this.setDefaults(defaults);
    //       console.log('prompt', prompt);
    //       return this.updateServer(prompt, serverId);
    //     }
    //   );
    // }
    // updateWithId(id:string):any {
    //   let serverId = this._copy(id);
    //   return this.updateServerChooserPrompt(serverId).subscribe(
    //     (answers: any) => {
    //       console.log('update', answers);
    //       // if (answers.server === this.takeMeOut) {
    //       //   return this.init(['server'], this._parent);
    //       // }
    //       let serverIndex:number = findIndex(this.userRc.config.server, {id: serverId});
    //       console.log(serverId)
    //       // let defaults:any = this.userRc.config.server[serverIndex];
    //       // console.log(serverIndex, defaults);
    //       // let prompt:any = this.setDefaults(defaults);
    //       // console.log('prompt', prompt);
    //       // this.updateServer(prompt);
    //     },
    //     (e: any) => {
    //     },
    //     () => {
    //     }
    //   );
    // }
    // update(id?: Array<string>):any {
    //   console.log('id', id);
    //   debugger;
    //   if (!this.userRc && !this.userRc.config && !this.userRc.config.server){
    //     return Observable.throw('no server are available');
    //   }
    //   if (!id || !id.length) {
    //     return this.updateWithoutId();
    //   }
    //   let serverId = id[0];
    //   return Observable.from(this.updateWithId(serverId));
    // }
    // /**
    //  * create a prompt like this
    //  * ```json
    //  * [ { type: 'list',
    //   message: 'Select Server/s',
    //   name: 'server',
    //   choices:
    //    [ 'cordev',
    //      'cordev2',
    //      'local dev',
    //      'ibx',
    //      't.beckmann',
    //      'beckmann new',
    //      'mdmdev2',
    //      'Take me out of here' ],
    //   validate: [Function] } ]
    //  * ```
    //  */
    // serverListPrompt(name: string = 'server', type: string = 'checkbox', message: string = 'Select Server/s') {
    //   let choices = map(this.userRc.config.server, 'id');
    //   choices.push(this.takeMeOut);
    //   return [
    //     {
    //       type: type,
    //       message: message,
    //       name: name,
    //       choices: choices,
    //       validate: (answer: Array<string>): any => {
    //         if (answer.length < 1) {
    //           return 'You must choose at least one server.';
    //         }
    //         return true;
    //       }
    //     }
    //   ];
    // }
    // deletePrompt() {
    //   return Observable.fromPromise(this.inquirer.prompt(this.serverListPrompt()));
    // }
    // rm() {
    //   this.deletePrompt().subscribe((answers: any) => {
    //     let all: any = [];
    //     if (answers.server.indexOf(this.takeMeOut) !== -1) {
    //       if (answers.server.length > 1) {
    //         console.log(`I see you choose servers and "Take me out of here" so you get out without remove`);
    //       }
    //       return this.init(['server'], this._parent);
    //     }
    //     answers.server.forEach((id: string) => {
    //       all.push(this.userRc.removeServer(id));
    //     });
    //     Observable.forkJoin(all).subscribe(
    //       (server: string) => {
    //         console.log(`${answers.server} are removed`);
    //       },
    //       (e: any) => console.error(`Something get wrong on remove the server`),
    //       () => this.init(['server'], this._parent)
    //     );
    //   });
    // }
    // setDefaults(defaults: ServerModel) {
    //   let myPrompt:any = this.addConfig;
    //   myPrompt.forEach((item: any) => {
    //     console.log(item, defaults);
    //     item.default = () => { return defaults[item.name] };
    //     item.message += PRESS_ENTER;
    //   });
    //   return myPrompt;
    // }
    // /**
    //  * the add scenario
    //  * @link https://github.com/SBoudrias/Inquirer.js/blob/master/examples/input.js
    //  */
    // addServerPrompt(id?: string) {
    //   //console.log('addServerPrompt');
    //   //for testing
    //   if (this.debug && !id) {
    //     this.setDefaults({
    //       id: id,
    //       serverUrl: 'https://coredev.com:1234',
    //       userName: 'pascal',
    //       password: 'foo',
    //       default: false
    //     });
    //   }
    //   //set default id
    //   if (id && id.length && id.match(Validator.stringNumberPattern)) {
    //     this.addConfig[0]['default'] = () => { return id.trim() };
    //   }
    //   return Observable.fromPromise(this.inquirer.prompt(this.addConfig));
    // }
    /**
     * add method
     */
    Server.prototype.add = function (params) {
        var _this = this;
        console.log(params);
        return this.crudHelper.add(params).subscribe(function () {
        }, function (e) {
            console.error(e);
        }, function () {
            console.log('hi');
            return _this.init(['server'], _this._parent);
        });
    };
    return Server;
}(Command_1.Command));
exports.Server = Server;
//# sourceMappingURL=Server.js.map