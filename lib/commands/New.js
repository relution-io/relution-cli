"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = require('./../utility/Command');
var rxjs_1 = require('@reactivex/rxjs');
var chalk = require('chalk');
var Translation_1 = require('./../utility/Translation');
var Create_1 = require('./new/Create');
var figures = require('figures');
/**
 * create a new Baas for the Developer
 */
var New = (function (_super) {
    __extends(New, _super);
    function New() {
        _super.call(this, 'new');
        this.commands = {
            create: {
                description: 'create a new Baas Backend',
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            help: {
                description: Translation_1.Translation.LIST_COMMAND('New')
            },
            quit: {
                description: 'Exit To Home'
            }
        };
        this._create = new Create_1.Create();
    }
    /**
     * @params name a string to create the project
     * @return Observable
     */
    New.prototype.create = function (name) {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            _this._create.publish().subscribe(function (status) {
                console.log(chalk.green(status.name + " is still generated " + chalk.green(figures.tick)));
            }, function (e) { return console.error(e); }, function () {
                observer.complete();
            });
        });
    };
    return New;
}(Command_1.Command));
exports.New = New;
//# sourceMappingURL=New.js.map