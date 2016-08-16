"use strict";
var Relution = require('relution-sdk');
var path = require('path');
var lodash_1 = require('lodash');
var rxjs_1 = require('@reactivex/rxjs');
var ConnectionModel_1 = require('./../../models/ConnectionModel');
var Gii_1 = require('./../../gii/Gii');
var RenderMetamodelContainer = (function () {
    function RenderMetamodelContainer(connection) {
        this.connection = connection;
        this._gii = new Gii_1.Gii();
        this._modelFactory = Relution.model.TypeScriptModelFactory;
    }
    RenderMetamodelContainer.prototype._chooseConnection = function () {
        var choices = this.connection.getConnectionNames();
        choices.push({ name: this.connection.i18n.CANCEL, value: this.connection.i18n.CANCEL });
        return rxjs_1.Observable.fromPromise(this.connection.inquirer.prompt({
            type: 'list',
            name: 'connectionname',
            message: this.connection.i18n.CHOOSE_LIST('Name'),
            choices: choices
        }));
    };
    RenderMetamodelContainer.prototype.create = function () {
        var _this = this;
        var treeDirectory;
        var relutionHjson;
        var choosedServer;
        var template = this._gii.getTemplateByName('connectionGen');
        var connectionModel = new ConnectionModel_1.ConnectionModel();
        /**
         * choose a connection from the local file system
         */
        return this._chooseConnection()
            .exhaustMap(function (answers) {
            treeDirectory = answers.connectionname;
            return connectionModel.fromJson(treeDirectory.path);
        })
            .exhaustMap(function (choosedConnection) {
            return _this.connection.fileApi.readHjson(path.join(process.cwd(), 'relution.hjson'));
        })
            .exhaustMap(function (resp) {
            relutionHjson = resp.data;
            return _this.connection.helperAdd.getServerPrompt();
        })
            .exhaustMap(function (server) {
            _this._defaultServer = _this.connection.helperAdd.defaultServer;
            if (server.connectserver.toString().trim() === _this._defaultServer.toString().trim()) {
                choosedServer = lodash_1.find(_this.connection.userRc.server, { default: true });
            }
            else {
                choosedServer = lodash_1.find(_this.connection.userRc.server, { id: server.connectserver });
            }
            return _this.connection.relutionSDK.login(choosedServer)
                .filter(function (resp) {
                return resp.user ? true : false;
            });
        })
            .exhaustMap(function (resp) {
            return _this.connection.getConnectionUUid(relutionHjson.uuid, connectionModel.name);
        })
            .exhaustMap(function (resp) {
            // console.log('resp', resp.items[0].calls);
            template.instance.metaData = [];
            template.instance.name = connectionModel.name;
            template.instance.path = path.dirname(connectionModel.name);
            var connection = resp.items[0];
            Object.keys(connection.calls).forEach(function (callName) {
                template.instance.metaData.push(connection.calls[callName]);
            });
            return _this.connection.getConnectionMetamodelContainer(connection.containerUuid).map(function (myResp) {
                return _this._modelFactory.instance.fromJSON(JSON.stringify(myResp));
            });
        })
            .exhaustMap(function (modelContainer) {
            // console.log('modelContainer', JSON.stringify(modelContainer, null, 2));
            template.instance.interfaces = [];
            modelContainer.models.forEach(function (metaModel) {
                template.instance.interfaces.push(metaModel);
            });
            // console.log(template.instance.template);
            return _this.connection.fileApi.writeFile(template.instance.template, template.instance.name + ".gen.ts", _this.connection.rootFolder);
        })
            .do({
            complete: function () {
                var exec = require('child_process').exec;
                exec('tsc -p .');
                return _this.connection.debuglog.info(connectionModel.name + " are updated!");
            }
        });
    };
    return RenderMetamodelContainer;
}());
exports.RenderMetamodelContainer = RenderMetamodelContainer;
//# sourceMappingURL=RenderMetamodelContainer.js.map