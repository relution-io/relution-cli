"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = require('./../utility/Command');
var FileApi_1 = require('./../utility/FileApi');
var path = require('path');
var Add_1 = require('./connection/Add');
var Connection = (function (_super) {
    __extends(Connection, _super);
    function Connection() {
        _super.call(this, 'connection');
        this.fileApi = new FileApi_1.FileApi();
        this.connectionRoot = path.join(process.cwd(), 'connections');
        this.commands = {
            add: {
                description: 'create a connection',
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            help: {
                description: this.i18n.LIST_COMMAND('Deploy')
            },
            quit: {
                description: this.i18n.EXIT_TO_HOME
            }
        };
        this.helperAdd = new Add_1.AddConnection(this);
    }
    Connection.prototype.add = function (path) {
        return this.helperAdd.add();
    };
    return Connection;
}(Command_1.Command));
exports.Connection = Connection;
//# sourceMappingURL=Connection.js.map