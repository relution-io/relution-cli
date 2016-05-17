"use strict";
var uuid = require('node-uuid');
var FileApi_1 = require('./../../../utility/FileApi');
var Translation_1 = require('./../../../utility/Translation');
/**
 * create the RelutionHjson file for the Project
 */
var RelutionHjson = (function () {
    function RelutionHjson() {
        this.publishName = 'relution.hjson';
        this.name = 'app';
        this._fileApi = new FileApi_1.FileApi();
        this._directoryIndex = false;
        this._server = 'app.js';
        this._private = false;
    }
    Object.defineProperty(RelutionHjson.prototype, "template", {
        get: function () {
            return this._fileApi.copyHjson("\n{\n  //app name\n  name: " + this.name + "\n  //description for the project\n  description: " + this.description + "\n  //on which baseAlias the app is available\n  baseAlias: " + this.baseAlias + "\n  //uuid identifier\n  uuid: " + this.uuid + "\n  //node start script\n  server: " + this.server + "\n  //shows directoryIndex on the Server good for debugging\n  directoryIndex: " + this.directoryIndex + "\n  //@todo have to be defined\n  private: " + this.private + "\n}\n").trim();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RelutionHjson.prototype, "description", {
        /**
         * The Description for the Project
         */
        get: function () {
            if (!this._description || !this._description.length) {
                this._description = Translation_1.Translation.RH_DESCRIPTION(this.name);
            }
            return this._description;
        },
        set: function (v) {
            this._description = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RelutionHjson.prototype, "private", {
        /**
         * is a private app or not
         */
        get: function () {
            return this._private;
        },
        set: function (v) {
            this._private = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RelutionHjson.prototype, "directoryIndex", {
        /**
         * show the directory Index on the Server
         */
        get: function () {
            return this._directoryIndex;
        },
        set: function (v) {
            this._directoryIndex = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RelutionHjson.prototype, "server", {
        /**
         * which file would be start from Node
         */
        get: function () {
            return "./" + this._server;
        },
        set: function (v) {
            this._server = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RelutionHjson.prototype, "uuid", {
        /**
         * set the uuid for the RelutionHjson if no is defined we are set one
         */
        get: function () {
            if (!this._uuid) {
                this._uuid = uuid.v1();
            }
            return this._uuid;
        },
        set: function (v) {
            this._uuid = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RelutionHjson.prototype, "baseAlias", {
        /**
         * set the baseALias to the app
         */
        get: function () {
            if (!this._baseAlias || !this._baseAlias.length) {
                this.baseAlias = this.name;
            }
            return "/" + this._baseAlias;
        },
        set: function (v) {
            this._baseAlias = v;
        },
        enumerable: true,
        configurable: true
    });
    return RelutionHjson;
}());
exports.RelutionHjson = RelutionHjson;
//# sourceMappingURL=RelutionHjson.js.map