"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = require('./../utility/Command');
var rxjs_1 = require('@reactivex/rxjs');
var Translation_1 = require('./../utility/Translation');
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
    }
    /**
     * @params name a string to create the project
     * @return Observable
     */
    New.prototype.create = function (name) {
        return rxjs_1.Observable.create(function (observer) {
        });
    };
    return New;
}(Command_1.Command));
exports.New = New;
//# sourceMappingURL=New.js.map