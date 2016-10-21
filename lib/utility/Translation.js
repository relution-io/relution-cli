"use strict";
var path = require('path');
function relative(pathname) {
    try {
        return path.relative(process.cwd(), pathname) || path.basename(pathname) || '.';
    }
    catch (error) {
        return pathname;
    }
}
var Translation = (function () {
    function Translation() {
    }
    Translation.ENV_IS_CREATED = function (name) {
        return "Environment " + name + " is generated.";
    };
    Translation.DEPLOY_ENV_NOT_EXISTS = function (env) {
        return env + " not exists in Environments!";
    };
    Translation.FOLDER_IS_NOT_A_RELUTION_PROJECT = function (folder) {
        return "Folder " + relative(folder) + " does not contain a Relution project, see \"How to migrate existing Project into a Relution Project\".";
    };
    Translation.LIST_AVAILABLE_CONFIG = function (name) {
        return "List available " + name + " configs.";
    };
    Translation.SELECT = function (name) {
        return "Select " + name + " :";
    };
    Translation.NOT_EMPTY = function (name) {
        return name + " must be specified.";
    };
    Translation.ENTER_SOMETHING_LABEL = function (name) {
        return "Please enter " + name;
    };
    Translation.CHOOSE_LIST = function (name) {
        return "Please choose a " + name + ":";
    };
    Translation.YOU_MUST_CHOOSE = function (name) {
        return "You must choose at least one " + name + ".";
    };
    Translation.HELP_COMMAND = function (name) {
        return "Help on " + name;
    };
    Translation.FOLDER_NOT_EXIST = function (folder) {
        return "Folder " + relative(folder) + " does not exist!";
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
        return type + " " + name + " created successfully.";
    };
    Translation.ALREADY_EXIST = function (name, type) {
        if (type === void 0) { type = 'Name'; }
        return "\n " + type + " \"" + name + "\" already exists please choose another one";
    };
    Translation.NOT_ALLOWED = function (name, pattern) {
        return "\n Name " + name + " has wrong character allowed only " + pattern;
    };
    Translation.FOLDER_NOT_EMPTY = function (path) {
        return "Folder " + relative(path) + " is not empty.";
    };
    Translation.ADD_ANOTHER = function (name) {
        return "You want to add another " + name + " ?";
    };
    Translation.ADD_ALSO = function (name) {
        return "You want to add also " + name + " ?";
    };
    Translation.PRESS_ENTER = ' or press enter';
    Translation.QUIT = 'back';
    Translation.ENTER_SOMETHING = "Please enter a ";
    Translation.CANCEL = 'Cancel';
    Translation.NOT_VALID = "Your Input is not valid";
    Translation.EXIT_TO_HOME = 'Back to Home';
    Translation.NPM_INSTALL = "Performing npm install which may take a while...";
    Translation.GENERAL_HELP_TABLEHEADERS = ['Group', 'Command', 'Parameters', 'Description'];
    /**
     * Server Command
     */
    Translation.SERVER_ADD = 'Add a new Server to the config';
    Translation.SERVER_LIST = 'List all available Server from config';
    Translation.SERVER_LIST_TABLEHEADERS = ['Server', 'URL', 'Default', 'Username'];
    Translation.SERVER_RM = 'Remove a Server from the config';
    Translation.SERVER_UPDATE = 'Update a exists server from the Server list';
    Translation.SERVER_CLIENTCERT = 'Specify a client certificate for contacting a Server';
    Translation.SERVER_CLIENTCERT_NOT_FOUND = 'File not found.';
    /*
     * Environment
     */
    Translation.ENV_LIST_TABLEHEADERS = ['Environment Name', 'Description'];
    Translation.ENV_UPDATE = 'Add a new key value pair to your Environment.';
    Translation.ENV_COPY = 'copy a exists Environment';
    Translation.ENV_UPDATE_COMPLETE = "Update complete";
    Translation.ENV_ADD_FIRSTLY = "Please add an Environment firstly!";
    /*
     * New Command
     */
    Translation.NEW_CREATE = "create a new Project in Folder";
    /*
     * Deploy Command
     */
    Translation.DEPLOY_PUBLISH = "deploy your Baas to the server";
    Translation.DEPLOY_NO_ORGA = "Organization has no defaultRoles. This will cause problems creating applications. Operation not permitted.";
    Translation.DEPLOY_SUCCESS = 'Deployment completed.';
    Translation.DEPLOY_FAILED = 'Deployment failed!';
    Translation.DEPLOY_APPURL = 'Your application is available at';
    /*
     * Debugger Command
     */
    Translation.DEBUGGER_OPEN_DESCRIPTION = 'open the node inspector with a specific Server.';
    Translation.DEBUGGER_OPEN_WHY = "You are not in a relution Project Folder";
    /*
     * Connection Command
     */
    Translation.CONNECTION_ADD_LABEL = "new connection";
    Translation.CONNECTION_ADD_DESCRIPTION = "Create a new connection.";
    Translation.CONNECTION_API_LIST_LABEL = "assign calls";
    Translation.CONNECTION_API_LIST_DESCRIPTION = "assign some calls to the choosen connection.";
    Translation.CONNECTION_ADD_CONNECTION_BEFORE = "Please add first a connection for this feature.";
    Translation.CONNECTION_ADD_SERVER_BEFORE = "Please add first a Server to create a Connection.";
    Translation.CONNECTION_LIST_TABLEHEADERS = ['Connection Name', 'Description'];
    Translation.CONNECTION_RENDER_METAMODEL_LABEL = 'add Metamodelcontainer';
    /**
     * Logger Command
     */
    Translation.LOGGER_LOG_WHY = "Logging is disabled";
    Translation.LOGGER_LOG_DESCRIPTION = "Logs your Server Livelogger.";
    /*
     * Push
     */
    Translation.PUSH_LIST_TABLEHEADERS = ['Push'];
    /**
     * Check Version
     */
    Translation.CLI_OFFLINE = '  Hey you are offline, this make sense ?';
    Translation.CLI_UPTODATE = function (version) {
        return " Your version " + version + " is up to date";
    };
    Translation.CLI_OUTOFDATE = function (version) {
        return " Version is outdated please update to " + version;
    };
    Translation.CLI_VERSION_CHECK_FAILED = ' Version check failed';
    return Translation;
}());
exports.Translation = Translation;
//# sourceMappingURL=Translation.js.map