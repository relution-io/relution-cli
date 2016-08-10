"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var ConnectionModel_1 = require('./../../models/ConnectionModel');
var RenderMetamodelContainer = (function () {
    function RenderMetamodelContainer(connection) {
        this.connection = connection;
        this._metaModelContainerUrl = "/gofer/meta-model/rest/modelContainers/";
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
        var treeDirectory;
        var connectionModel = new ConnectionModel_1.ConnectionModel();
        return this._chooseConnection()
            .exhaustMap(function (answers) {
            treeDirectory = answers.connectionname;
            return connectionModel.fromJson(treeDirectory.path);
        })
            .map(function (foo) {
            console.log(foo);
            return rxjs_1.Observable.empty();
        });
    };
    return RenderMetamodelContainer;
}());
exports.RenderMetamodelContainer = RenderMetamodelContainer;
//# sourceMappingURL=RenderInterfaces.js.map