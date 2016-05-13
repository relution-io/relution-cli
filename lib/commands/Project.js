"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = require('./../utility/Command');
/**
 * create a new Baas for the Developer
 */
var Project = (function (_super) {
    __extends(Project, _super);
    function Project() {
        _super.call(this, 'project');
        this.commands = {
            add: {
                description: 'Create a new Baas Backend',
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            help: {
                description: 'List the Environment Command'
            },
            quit: {
                description: 'Exit To Home'
            }
        };
    }
    Project.prototype.add = function () {
    };
    return Project;
}(Command_1.Command));
exports.Project = Project;
//# sourceMappingURL=Project.js.map