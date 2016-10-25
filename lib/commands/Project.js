"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = require('./Command');
var rxjs_1 = require('@reactivex/rxjs');
var FileApi_1 = require('./../utility/FileApi');
var Create_1 = require('./project/Create');
var Deploy_1 = require('./project/Deploy');
var Debugger_1 = require('./project/Debugger');
var Logger_1 = require('./project/Logger');
var RxFs_1 = require('./../utility/RxFs');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
/**
 * create a new Baas for the Developer
 * ```bash
 * ┌─────────┬──────────┬──────────┬────────────────────────────────┐
 * │ Options │ Commands │ Param(s) │ Description                    │
 * │         │          │          │                                │
 * │ new     │ create   │ <$name>  │ create a new Project in Folder │
 * │ new     │ help     │ --       │ List the New Command           │
 * │ new     │ back     │ --       │ Exit to Home                   │
 * │         │          │          │                                │
 * └─────────┴──────────┴──────────┴────────────────────────────────┘
 * ```
 */
var Project = (function (_super) {
    __extends(Project, _super);
    function Project() {
        var _this = this;
        _super.call(this, 'project');
        this.commands = {
            create: {
                when: function () {
                    var files = fs.readdirSync(process.cwd());
                    if (_.some(files, function (file) { return !/(^|\/)\.[^\/\.]/g.test(file); })) {
                        return false;
                    }
                    return true;
                },
                why: function () {
                    return _this.i18n.FOLDER_NOT_EMPTY(process.cwd());
                },
                description: this.i18n.NEW_CREATE,
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            deploy: {
                description: this.i18n.DEPLOY_PUBLISH,
                when: function () {
                    return RxFs_1.RxFs.exist(path.join(process.cwd(), 'relution.hjson'));
                },
                why: function () {
                    if (!RxFs_1.RxFs.exist(path.join(process.cwd(), 'relution.hjson'))) {
                        return _this.i18n.FOLDER_IS_NOT_A_RELUTION_PROJECT(path.join(process.cwd()));
                    }
                },
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            debug: {
                when: function () {
                    return RxFs_1.RxFs.exist(path.join(process.cwd(), 'relution.hjson'));
                },
                why: function () {
                    return _this.i18n.DEBUGGER_OPEN_WHY;
                },
                description: this.i18n.DEBUGGER_OPEN_DESCRIPTION,
                vars: {
                    server: {
                        pos: 0
                    }
                }
            },
            log: {
                label: 'logger',
                when: function () {
                    return RxFs_1.RxFs.exist(path.join(process.cwd(), 'relution.hjson'));
                },
                why: function () {
                    return _this.i18n.LOGGER_LOG_WHY;
                },
                description: this.i18n.LOGGER_LOG_DESCRIPTION,
                vars: {
                    serverName: {
                        pos: 0
                    },
                    level: {
                        pos: 1
                    }
                }
            },
            help: {
                description: this.i18n.HELP_COMMAND('Project')
            },
            back: {
                description: this.i18n.EXIT_TO_HOME
            }
        };
        this._fsApi = new FileApi_1.FileApi();
        this._create = new Create_1.Create();
    }
    /**
     * @params name a string to create the project
     * @return Observable
     */
    Project.prototype.create = function (name) {
        var _this = this;
        var files = [];
        return rxjs_1.Observable.create(function (observer) {
            _this._fsApi.fileList(process.cwd()).subscribe({
                next: function (file) {
                    if (!/(^|\/)\.[^\/\.]/g.test(file)) {
                        console.log(file);
                        files.push(file);
                    }
                },
                complete: function () {
                    if (!files.length) {
                        _this._create.publish().subscribe(function (resp) { observer.next(resp); }, function (e) { return observer.error(e); }, function () { observer.complete(); });
                    }
                    else {
                        observer.error(new Error(_this.i18n.FOLDER_NOT_EMPTY(process.cwd())));
                        observer.complete();
                    }
                }
            });
        });
    };
    Project.prototype.deploy = function (args) {
        return new Deploy_1.Deploy(this).publish(args);
    };
    Project.prototype.debug = function () {
        return new Debugger_1.Debugger(this).open();
    };
    Project.prototype.log = function (args) {
        return new Logger_1.Logger(this).log(args);
    };
    return Project;
}(Command_1.Command));
exports.Project = Project;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9Qcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdCQUFzQixXQUFXLENBQUMsQ0FBQTtBQUNsQyxxQkFBeUIsaUJBQWlCLENBQUMsQ0FBQTtBQUMzQyx3QkFBc0Isc0JBQXNCLENBQUMsQ0FBQTtBQUU3Qyx1QkFBcUIsa0JBQWtCLENBQUMsQ0FBQTtBQUN4Qyx1QkFBcUIsa0JBQWtCLENBQUMsQ0FBQTtBQUN4Qyx5QkFBdUIsb0JBQW9CLENBQUMsQ0FBQTtBQUM1Qyx1QkFBcUIsa0JBQWtCLENBQUMsQ0FBQTtBQUV4QyxxQkFBbUIsbUJBQW1CLENBQUMsQ0FBQTtBQUN2QyxJQUFZLEVBQUUsV0FBTSxJQUFJLENBQUMsQ0FBQTtBQUN6QixJQUFZLElBQUksV0FBTSxNQUFNLENBQUMsQ0FBQTtBQUM3QixJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUU1Qjs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSDtJQUE2QiwyQkFBTztJQStFbEM7UUEvRUYsaUJBNEhDO1FBNUNHLGtCQUFNLFNBQVMsQ0FBQyxDQUFDO1FBOUVaLGFBQVEsR0FBUTtZQUNyQixNQUFNLEVBQUU7Z0JBQ04sSUFBSSxFQUFFO29CQUNKLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7b0JBQzFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFVBQUMsSUFBSSxJQUFLLE9BQUEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQTlCLENBQThCLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzVELE1BQU0sQ0FBQyxLQUFLLENBQUM7b0JBQ2YsQ0FBQztvQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNkLENBQUM7Z0JBQ0QsR0FBRyxF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