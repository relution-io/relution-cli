"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var rxjs_1 = require('@reactivex/rxjs');
var Command_1 = require('./Command');
var ServerCrud_1 = require('./server/ServerCrud');
var lodash_1 = require('lodash');
/**
 * Relution Server Command
 * ```bash
 * ┌─────────┬──────────┬──────────┬────────────────────────────────────────────┐
 * │ Options │ Commands │ Param(s) │ Description                                │
 * │         │          │          │                                            │
 * │ server  │ add      │ <$name>  │ Add a new Server to the config             │
 * │ server  │ list     │ <$name>  │ List all available Server from config      │
 * │ server  │ update   │ <$name>  │ Update a exist server from the Server list │
 * │ server  │ rm       │ <$name>  │ Remove a Server from the config            │
 * │ server  │ help     │ --       │ List the Server Command                    │
 * │ server  │ back     │ --       │ Exit to Home                               │
 * │         │          │          │                                            │
 * └─────────┴──────────┴──────────┴────────────────────────────────────────────┘
 * ```
 */
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
            clientcert: {
                description: this.i18n.SERVER_CLIENTCERT,
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
                description: this.i18n.HELP_COMMAND('Server')
            },
            back: {
                description: this.i18n.EXIT_TO_HOME
            }
        };
    }
    Server.prototype.preload = function () {
        var _this = this;
        return _super.prototype.preload.call(this)
            .map(function () {
            _this.crudHelper = new ServerCrud_1.ServerCrud(_this);
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
            observer.next(_this.table.sidebar(content, _this.i18n.SERVER_LIST_TABLEHEADERS));
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
    Server.prototype.clientcert = function (params) {
        return this.crudHelper.clientcert(params);
    };
    return Server;
}(Command_1.Command));
exports.Server = Server;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL1NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxxQkFBeUIsaUJBQWlCLENBQUMsQ0FBQTtBQUMzQyx3QkFBc0IsV0FBVyxDQUFDLENBQUE7QUFDbEMsMkJBQXlCLHFCQUFxQixDQUFDLENBQUE7QUFFL0MsdUJBQXlDLFFBQVEsQ0FBQyxDQUFBO0FBQ2xEOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNIO0lBQTRCLDBCQUFPO0lBc0RqQztRQUNFLGtCQUFNLFFBQVEsQ0FBQyxDQUFDO1FBdERYLGdCQUFXLEdBQWtCLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDM0UsVUFBSyxHQUFZLElBQUksQ0FBQztRQUd0QixhQUFRLEdBQVc7WUFDeEIsR0FBRyxFQUFFO2dCQUNILFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVU7Z0JBQ2pDLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUU7d0JBQ0osR0FBRyxFQUFFLENBQUM7cUJBQ1A7aUJBQ0Y7YUFDRjtZQUNELElBQUksRUFBRTtnQkFDSixXQUFXLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXO2dCQUNsQyxJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFO3dCQUNKLEdBQUcsRUFBRSxDQUFDO3FCQUNQO2lCQUNGO2FBQ0Y7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYTtnQkFDcEMsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRTt3QkFDSixHQUFHLEVBQUUsQ0FBQztxQkFDUDtpQkFDRjthQUNGO1lBQ0QsVUFBVSxFQUFFO2dCQUNWLFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQjtnQkFDeEMsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRTt3QkFDSixH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