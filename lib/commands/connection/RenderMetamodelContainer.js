"use strict";
var Relution = require('relution-sdk');
var path = require('path');
var lodash_1 = require('lodash');
var rxjs_1 = require('@reactivex/rxjs');
var ConnectionModel_1 = require('./../../models/ConnectionModel');
var Gii_1 = require('./../../gii/Gii');
var TsBeautifier_1 = require('./../../gii/TsBeautifier');
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
            template.instance.interfaceOn = true;
            modelContainer.models.forEach(function (metaModel) {
                template.instance.interfaces.push(metaModel);
            });
            // console.log(template.instance.template);
            return _this.connection.fileApi.writeFile(template.instance.template, template.instance.name + ".gen.ts", _this.connection.rootFolder)
                .exhaustMap(function () {
                return TsBeautifier_1.TsBeautifier.format([path.join(_this.connection.rootFolder, template.instance.name + ".gen.ts")]);
            });
        })
            .map(function () {
            var exec = require('child_process').exec;
            exec("tsc -p " + process.cwd());
        })
            .exhaustMap(function () {
            return _this.connection._parent.staticCommands.project.deploy([choosedServer.id]);
        })
            .do({
            complete: function () {
                return _this.connection.debuglog.info(connectionModel.name + " are updated!");
            }
        });
    };
    return RenderMetamodelContainer;
}());
exports.RenderMetamodelContainer = RenderMetamodelContainer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVuZGVyTWV0YW1vZGVsQ29udGFpbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2Nvbm5lY3Rpb24vUmVuZGVyTWV0YW1vZGVsQ29udGFpbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFZLFFBQVEsV0FBTSxjQUFjLENBQUMsQ0FBQTtBQUN6QyxJQUFZLElBQUksV0FBTSxNQUFNLENBQUMsQ0FBQTtBQUM3Qix1QkFBbUIsUUFBUSxDQUFDLENBQUE7QUFHNUIscUJBQXlCLGlCQUFpQixDQUFDLENBQUE7QUFFM0MsZ0NBQThCLGdDQUFnQyxDQUFDLENBQUE7QUFDL0Qsb0JBQWtCLGlCQUFpQixDQUFDLENBQUE7QUFDcEMsNkJBQTJCLDBCQUEwQixDQUFDLENBQUE7QUFFdEQ7SUFRRSxrQ0FBbUIsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQU5qQyxTQUFJLEdBQUcsSUFBSSxTQUFHLEVBQUUsQ0FBQztRQUtqQixrQkFBYSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUM7SUFDbEIsQ0FBQztJQUVyQyxvREFBaUIsR0FBekI7UUFDRSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDbkQsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFFdEYsTUFBTSxDQUFDLGlCQUFVLENBQUMsV0FBVyxDQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDOUIsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUUsZ0JBQWdCO1lBQ3RCLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxD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