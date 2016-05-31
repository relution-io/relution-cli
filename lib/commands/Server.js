"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var rxjs_1 = require('@reactivex/rxjs');
var Command_1 = require('./../utility/Command');
var ServerCrud_1 = require('./server/ServerCrud');
var lodash_1 = require('lodash');
var Server = (function (_super) {
    __extends(Server, _super);
    function Server() {
        _super.call(this, 'server');
        this.tableHeader = ['Name', 'Server url', 'Default', 'Username'];
        this.debug = true;
        this.commands = {
            add: {
                description: this.i18n.SERVER_ADD,
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            list: {
                description: this.i18n.SERVER_LIST,
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            update: {
                description: this.i18n.SERVER_UPDATE,
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            rm: {
                description: this.i18n.SERVER_RM,
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            help: {
                description: this.i18n.LIST_COMMAND('Server')
            },
            quit: {
                description: this.i18n.EXIT_TO_HOME
            }
        };
    }
    Server.prototype.preload = function () {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            _super.prototype.preload.call(_this).subscribe({
                complete: function () {
                    _this.crudHelper = new ServerCrud_1.ServerCrud(_this);
                    observer.complete();
                }
            });
        });
    };
    /**
     * list available Server
     */
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
            observer.next(_this.table.sidebar(content));
            observer.complete();
        });
    };
    /**
     * update existing Server
     */
    Server.prototype.update = function (params) {
        return this.crudHelper.update(params);
    };
    /**
     * Delete a Server from the RC file Object
     */
    Server.prototype.rm = function (id) {
        return this.crudHelper.rm(id);
    };
    /**
     * add method
     */
    Server.prototype.add = function (params) {
        return this.crudHelper.add(params);
    };
    return Server;
}(Command_1.Command));
exports.Server = Server;
//# sourceMappingURL=Server.js.map