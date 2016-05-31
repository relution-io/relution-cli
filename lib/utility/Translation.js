"use strict";
var Translation = (function () {
    function Translation() {
    }
    Translation.SELECT = function (name) {
        return "Select " + name + " :";
    };
    Translation.NOT_EMPTY = function (name) {
        return name + " can not be empty";
    };
    Translation.CHOOSE_LIST = function (name) {
        return "Please choose a " + name + ":";
    };
    Translation.YOU_MOUST_CHOOSE = function (name) {
        return "You must choose at least one " + name + ".";
    };
    Translation.LIST_COMMAND = function (name) {
        return "List the " + name + " Command";
    };
    Translation.RH_DESCRIPTION = function (name) {
        return "Auto Generated Description for " + name + ".";
    };
    Translation.HJSON_WRITTEN = function (name) {
        return Translation.WRITTEN(name + ".hjson");
    };
    Translation.FOLDER_WRITTEN = function (name) {
        return Translation.WRITTEN(name, 'Folder');
    };
    Translation.FOLDERS_WRITTEN = function (name) {
        return Translation.WRITTEN(name, 'Folders');
    };
    Translation.FILES_WRITTEN = function (name) {
        return Translation.WRITTEN(name, 'Files');
    };
    Translation.WRITTEN = function (name, type) {
        if (type === void 0) { type = 'File'; }
        return type + " \"" + name + "\" are created";
    };
    Translation.ALREADY_EXIST = function (name, type) {
        if (type === void 0) { type = 'Name'; }
        return "\n " + type + " \"" + name + "\" already exist please choose another one";
    };
    Translation.NOT_ALLOWED = function (name, pattern) {
        return "\n Name " + name + " has wrong character allowed only " + pattern;
    };
    Translation.FOLDER_NOT_EMPTY = function (path) {
        return path + " is not empty please clean it up before!";
    };
    Translation.ADD_ANOTHER = function (name) {
        return "You want to add another " + name + " ?";
    };
    Translation.ADD_ALSO = function (name) {
        return "You want to add also " + name + " ?";
    };
    Translation.PRESS_ENTER = ' or press enter';
    Translation.QUIT = 'quit';
    Translation.ENTER_SOMETHING = "Please enter a ";
    Translation.TAKE_ME_OUT = 'Take me out of here';
    Translation.NOT_VALID = "Your Input is not valid";
    Translation.EXIT_TO_HOME = 'Exit to Home';
    Translation.SERVER_ADD = 'Add a new Server to the config';
    Translation.SERVER_LIST = 'List all available Server from config';
    Translation.SERVER_RM = 'Remove a Server from the config';
    Translation.SERVER_UPDATE = 'Update a exist server from the Server list';
    Translation.NEW_CREATE = "create a new Project in Folder";
    Translation.DEPLOY = "deploy your Baas to the server";
    Translation.NPM_INSTALL = "Start npm install this take a while";
    return Translation;
}());
exports.Translation = Translation;
//# sourceMappingURL=Translation.js.map