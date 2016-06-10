"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = require('./../utility/Command');
var FileApi_1 = require('./../utility/FileApi');
var RxFs_1 = require('./../utility/RxFs');
var lodash_1 = require('lodash');
var path = require('path');
var Add_1 = require('./connection/Add');
var ApiList_1 = require('./connection/ApiList');
var rxjs_1 = require('@reactivex/rxjs');
var ConnectionModel_1 = require('./../models/ConnectionModel');
/**
 * Connection
 * ```bash
 * ┌────────────┬──────────┬──────────┬─────────────────────────┐
 * │ Options    │ Commands │ Param(s) │ Description             │
 * │            │          │          │                         │
 * │ connection │ add      │ <$name>  │ create a connection     │
 * │ connection │ help     │ --       │ List the Deploy Command │
 * │ connection │ back     │ --       │ Exit to Home            │
 * │            │          │          │                         │
 * └────────────┴──────────┴──────────┴─────────────────────────┘
 * ```
 */
var Connection = (function (_super) {
    __extends(Connection, _super);
    function Connection() {
        var _this = this;
        _super.call(this, 'connection');
        this.fileApi = new FileApi_1.FileApi();
        this.rootFolder = path.join(process.cwd(), 'connections');
        this.commands = {
            add: {
                when: function () { return _this.addEnabled(); },
                why: function () { return _this.addWhyDisabled(); },
                label: this.i18n.CONNECTION_ADD_LABEL,
                method: 'add',
                description: this.i18n.CONNECTION_ADD_DESCRIPTION,
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            apilist: {
                when: function () {
                    return _this.connectionsDirTree.length <= 0 ? false : true;
                },
                why: function () {
                    return _this.i18n.CONNECTION_ADD_CONNECTION_BEFORE;
                },
                label: this.i18n.CONNECTION_API_LIST_LABEL,
                method: 'apiList',
                description: this.i18n.CONNECTION_API_LIST_DESCRIPTION,
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            help: {
                description: this.i18n.HELP_COMMAND('Connections')
            },
            back: {
                description: this.i18n.EXIT_TO_HOME
            }
        };
        this.helperAdd = new Add_1.AddConnection(this);
        this.helperApiList = new ApiList_1.ApiList(this);
        this.connectionsDirTree = [];
    }
    /**
     * get all Connections form the rootfolder
     */
    Connection.prototype.flatTree = function (tree, store) {
        var _this = this;
        if (store === void 0) { store = []; }
        if (!tree) {
            return store;
        }
        ;
        if (tree.children) {
            return this.flatTree(tree.children, store);
        }
        tree.forEach(function (branch) {
            if (branch.children) {
                return _this.flatTree(branch.children, store);
            }
            if (branch.path) {
                branch.baseNameRelativ = branch.path.replace(_this.rootFolder + "/", '');
                store.push(branch);
            }
        });
        return store;
    };
    Connection.prototype.getConnectionNames = function () {
        return lodash_1.map(this.connectionsDirTree, function (item) {
            return { name: item.connection.name, value: item };
        });
    };
    Connection.prototype.streamConnectionFromFileSystem = function () {
        var _this = this;
        this.connectionsDirTree = this.flatTree(this.fileApi.dirTree(this.rootFolder, ['.hjson']));
        var forkjoin = [];
        this.connectionsDirTree.forEach(function (connection) {
            forkjoin.push(_this.fileApi.readHjson(connection.path));
        });
        return rxjs_1.Observable.forkJoin(forkjoin).map(function (hjsonsRead) {
            hjsonsRead.forEach(function (hjsonFile) {
                var index = lodash_1.findIndex(_this.connectionsDirTree, { path: hjsonFile.path });
                if (index > -1) {
                    _this.connectionsDirTree[index].connection = new ConnectionModel_1.ConnectionModel(hjsonFile.data);
                }
            });
            return _this.connectionsDirTree;
        });
    };
    Connection.prototype.preload = function () {
        var _this = this;
        return _super.prototype.preload.call(this).exhaustMap(function () {
            return _this.streamConnectionFromFileSystem();
        });
    };
    Connection.prototype.apiList = function (name) {
        return this.helperApiList.apiList();
    };
    Connection.prototype.add = function (path) {
        return this.helperAdd.add();
    };
    /**
     * check if the connection add command is disabled
     */
    Connection.prototype.addEnabled = function () {
        if (!this.userRc.server.length) {
            return false;
        }
        if (!RxFs_1.RxFs.exist(this.rootFolder)) {
            return false;
        }
        return true;
    };
    /**
     * return why is is not enabld
     */
    Connection.prototype.addWhyDisabled = function () {
        if (!this.userRc.server.length) {
            return this.i18n.CONNECTION_ADD_SERVER_BEFORE;
        }
        if (!RxFs_1.RxFs.exist(this.rootFolder)) {
            return this.i18n.FOLDER_NOT_EXIST(this.rootFolder);
        }
    };
    return Connection;
}(Command_1.Command));
exports.Connection = Connection;
//# sourceMappingURL=Connection.js.map