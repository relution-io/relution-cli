"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = require('./../Command');
var SubCommand_1 = require('./../SubCommand');
var Home = (function (_super) {
    __extends(Home, _super);
    function Home() {
        _super.call(this);
        this.name = 'Home';
        this.commands = [new SubCommand_1.SubCommand('start')];
        console.log(this.commands);
    }
    return Home;
}(Command_1.Command));
exports.Home = Home;
//# sourceMappingURL=Home.js.map