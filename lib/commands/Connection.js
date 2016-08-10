"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var path = require('path');
var chalk = require('chalk');
var Command_1 = require('./Command');
var FileApi_1 = require('./../utility/FileApi');
var RxFs_1 = require('./../utility/RxFs');
var lodash_1 = require('lodash');
var Add_1 = require('./connection/Add');
var ApiList_1 = require('./connection/ApiList');
var RenderMetamodelContainer_1 = require('./connection/RenderMetamodelContainer');
var rxjs_1 = require('@reactivex/rxjs');
var ConnectionModel_1 = require('./../models/ConnectionModel');
var Relution = require('relution-sdk');
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
            createInterfaces: {
                label: this.i18n.CONNECTION_RENDER_METAMODEL_LABEL
            },
            list: {
                when: function () {
                    return RxFs_1.RxFs.exist(_this.rootFolder);
                },
                why: function () {
                    return _this.i18n.FOLDER_NOT_EXIST(_this.rootFolder);
                },
                description: this.i18n.LIST_AVAILABLE_CONFIG('Connections'),
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
        this.helperMetaModelContainer = new RenderMetamodelContainer_1.RenderMetamodelContainer(this);
        this.connectionsDirTree = [];
        /**
         * Query Filter to get the connection from the Server
         */
        this.connectionFilter = {
            'type': 'logOp',
            'operation': 'AND',
            'filters': [
                {
                    'type': 'string',
                    'fieldName': 'application',
                    'value': ''
                },
                {
                    'type': 'string',
                    'fieldName': 'name',
                    'value': ''
                }
            ]
        };
    }
    Connection.prototype.preload = function () {
        var _this = this;
        return _super.prototype.preload.call(this).exhaustMap(function () {
            return _this.streamConnectionFromFileSystem();
        });
    };
    Object.defineProperty(Connection.prototype, "metaModelContainerUrl", {
        get: function () {
            return this._metaModelContainerUrl;
        },
        set: function (containerUuid) {
            this._metaModelContainerUrl = "/gofer/meta-model/rest/modelContainers/" + containerUuid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Connection.prototype, "callsUrl", {
        get: function () {
            return this._callsUrl;
        },
        set: function (v) {
            this._callsUrl = "/mcap/connector/rest/connectors/" + v + "/calls";
        },
        enumerable: true,
        configurable: true
    });
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
    Object.defineProperty(Connection.prototype, "uuidConnectionUrl", {
        /**
         * simple getter
         */
        get: function () {
            return this._uuidConnectionUrl;
        },
        enumerable: true,
        configurable: true
    });
    Connection.prototype.setUuidConnectionUrl = function (uuid, connectionName) {
        this.connectionFilter.filters[0].value = uuid;
        this.connectionFilter.filters[1].value = connectionName;
        var query = encodeURIComponent("" + JSON.stringify(this.connectionFilter));
        this._uuidConnectionUrl = ("/mcap/connector/rest/connectors/?filter=" + query + "&field=uuid&field=containerUuid&field=calls");
    };
    Connection.prototype.getConnectionNames = function () {
        return lodash_1.map(this.connectionsDirTree, function (item) {
            return { name: item.connection.name, value: item };
        });
    };
    /**
     * fetch the uuid from the server by query
     */
    Connection.prototype.getConnectionUUid = function (appUUid, connectionName) {
        this.setUuidConnectionUrl(appUUid, connectionName);
        return rxjs_1.Observable.fromPromise(Relution.web.ajax({
            method: 'GET',
            url: this.uuidConnectionUrl
        }));
    };
    /**
     * return a list of availables calls for the connection
     */
    Connection.prototype.getConnectionCalls = function (connectionUuid) {
        this.callsUrl = connectionUuid;
        return rxjs_1.Observable.fromPromise(Relution.web.ajax({
            method: 'GET',
            url: this.callsUrl
        }));
    };
    /**
     * return a list of availables metamodel for the connection
     */
    Connection.prototype.getConnectionMetamodelContainer = function (containerUuid) {
        this.metaModelContainerUrl = containerUuid;
        return rxjs_1.Observable.fromPromise(Relution.web.ajax({
            method: 'GET',
            url: this.metaModelContainerUrl
        }));
    };
    /**
     * return all connections from the connection folder
     */
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
    /**
     * Add some calls to the connection
     */
    Connection.prototype.apiList = function (name) {
        return this.helperApiList.apiList();
    };
    /**
     * create a new connection
     */
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
    /**
     * shows all available connections
     * @returns Observable
     */
    Connection.prototype.list = function () {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            var content = [['']];
            _this.getConnectionNames().forEach(function (connection) {
                var model = connection.value && connection.value.connection;
                content.push([
                    chalk.yellow(connection.name),
                    model && model.description || ''
                ]);
            });
            if (content.length < 1) {
                observer.complete();
            }
            observer.next(_this.table.sidebar(content, _this.i18n.CONNECTION_LIST_TABLEHEADERS));
            observer.complete();
        });
    };
    Connection.prototype.createInterfaces = function () {
        return this.helperMetaModelContainer.create();
    };
    return Connection;
}(Command_1.Command));
exports.Connection = Connection;
//# sourceMappingURL=Connection.js.map