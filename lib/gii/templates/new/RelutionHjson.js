"use strict";
var uuid = require('node-uuid');
var FileApi_1 = require('./../../../utility/FileApi');
var Translation_1 = require('./../../../utility/Translation');
var html = require('common-tags').html;
/**
 * create the RelutionHjson file for the Project
 */
var RelutionHjson = (function () {
    function RelutionHjson() {
        this.publishName = 'relution.hjson';
        this.name = 'app';
        this._fileApi = new FileApi_1.FileApi();
        this._directoryIndex = true;
        this._server = 'app.js';
        this._private = false;
        this._client = './www';
    }
    Object.defineProperty(RelutionHjson.prototype, "template", {
        get: function () {
            return this._fileApi.copyHjson((_a = ["\n      {\n        //app name\n        name: ", "\n        //description for the project\n        description: ", "\n        //on which baseAlias the app is available\n        baseAlias: ", "\n        //uuid identifier dont touch it!!!\n        uuid: ", "\n        //static files root folder to your client application\n        client: ", "\n        //node start script\n        server: ", "\n        //shows directoryIndex on the Server good for debugging\n        //directoryIndex: ", "\n        //if this attribute is set to true no anonymous user can see the app\n        private: ", "\n      }\n    "], _a.raw = ["\n      {\n        //app name\n        name: ", "\n        //description for the project\n        description: ", "\n        //on which baseAlias the app is available\n        baseAlias: ", "\n        //uuid identifier dont touch it!!!\n        uuid: ", "\n        //static files root folder to your client application\n        client: ", "\n        //node start script\n        server: ", "\n        //shows directoryIndex on the Server good for debugging\n        //directoryIndex: ", "\n        //if this attribute is set to true no anonymous user can see the app\n        private: ", "\n      }\n    "], html(_a, this.name, this.description, this.baseAlias, this.uuid, this.client, this.server, this.directoryIndex, this.private)));
            var _a;
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
    Object.defineProperty(RelutionHjson.prototype, "client", {
        get: function () {
            return this._client;
        },
        set: function (v) {
            this._client = v;
        },
        enumerable: true,
        configurable: true
    });
    return RelutionHjson;
}());
exports.RelutionHjson = RelutionHjson;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVsdXRpb25IanNvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9naWkvdGVtcGxhdGVzL25ldy9SZWx1dGlvbkhqc29uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFZLElBQUksV0FBTSxXQUFXLENBQUMsQ0FBQTtBQUNsQyx3QkFBc0IsNEJBQTRCLENBQUMsQ0FBQTtBQUNuRCw0QkFBMEIsZ0NBQWdDLENBQUMsQ0FBQTtBQUUzRCxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ3pDOztHQUVHO0FBRUg7SUFBQTtRQUVTLGdCQUFXLEdBQVcsZ0JBQWdCLENBQUM7UUFDdkMsU0FBSSxHQUFXLEtBQUssQ0FBQztRQUdwQixhQUFRLEdBQVksSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFFbEMsb0JBQWUsR0FBWSxJQUFJLENBQUM7UUFDaEMsWUFBTyxHQUFXLFFBQVEsQ0FBQztRQUMzQixhQUFRLEdBQVksS0FBSyxDQUFDO1FBRTFCLFlBQU8sR0FBVyxPQUFPLENBQUM7SUEyR3BDLENBQUM7SUF6R0Msc0JBQUksbUNBQVE7YUFBWjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFJLCtDQUd2QixFQUFTLGdFQUVGLEVBQWdCLDBFQUVsQixFQUFjLDhEQUVuQixFQUFTLG1GQUVQLEVBQVcsaURBRVgsRUFBVywrRkFFRCxFQUFtQixtR0FFNUIsRUFBWSxpQkFFMUIsOG1CQW5COEIsSUFBSSxLQUd2QixJQUFJLENBQUMsSUFBSSxFQUVGLElBQUksQ0FBQyxXQUFXLEVBRWxCLElBQUksQ0FBQyxTQUFTLEVBRW5CLElBQUksQ0FBQyxJQUFJLEVBRVAsSUFBSSxDQUFDLE1BQU0sRUFFWCxJQUFJLENBQUMsTUFBTSxFQUVELElBQUksQ0FBQyxjQUFjLEVBRTVCLElBQUksQ0FBQyxPQUFPLEVBRTFCLENBQUMsQ0FBQzs7UUFDTCxD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