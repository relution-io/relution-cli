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
                label: this.i18n.CONNECTION_GENERATE_CODE
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ubmVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9Db25uZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQVksSUFBSSxXQUFNLE1BQU0sQ0FBQyxDQUFBO0FBQzdCLElBQVksS0FBSyxXQUFNLE9BQU8sQ0FBQyxDQUFBO0FBRS9CLHdCQUFzQixXQUFXLENBQUMsQ0FBQTtBQUNsQyx3QkFBc0Isc0JBQXNCLENBQUMsQ0FBQTtBQUM3QyxxQkFBbUIsbUJBQW1CLENBQUMsQ0FBQTtBQUN2Qyx1QkFBNkIsUUFBUSxDQUFDLENBQUE7QUFDdEMsb0JBQTRCLGtCQUFrQixDQUFDLENBQUE7QUFDL0Msd0JBQXNCLHNCQUFzQixDQUFDLENBQUE7QUFDN0MseUNBQXVDLHVDQUF1QyxDQUFDLENBQUE7QUFDL0UscUJBQXlCLGlCQUFpQixDQUFDLENBQUE7QUFDM0MsZ0NBQThCLDZCQUE2QixDQUFDLENBQUE7QUFDNUQsSUFBWSxRQUFRLFdBQU0sY0FBYyxDQUFDLENBQUE7QUFXekM7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0g7SUFBZ0MsOEJBQU87SUE2RHJDO1FBN0RGLGlCQStRQztRQWpORyxrQkFBTSxZQUFZLENBQUMsQ0FBQztRQTdEZixZQUFPLEdBQVksSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFDakMsZUFBVSxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBTTdELGFBQVEsR0FBUTtZQUNyQixHQUFHLEVBQUU7Z0JBQ0gsSUFBSSxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsVUFBVSxFQUFFLEVBQWpCLENBQWlCO2dCQUM3QixHQUFHLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxjQUFjLEVBQUUsRUFBckIsQ0FBcUI7Z0JBQ2hDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQjtnQkFDckMs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