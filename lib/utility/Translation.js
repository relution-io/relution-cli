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
    Translation.CONNECTION_GENERATE_CODE = 'generate code';
    /**
     * Logger Command
     */
    Translation.LOGGER_LOG_WHY = "Logging is disabled";
    Translation.LOGGER_LOG_DESCRIPTION = "Logs your Server Livelogger.";
    /*
     * Push
     */
    Translation.PUSH_LIST_TABLEHEADERS = ['Push'];
    return Translation;
}());
exports.Translation = Translation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNsYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbGl0eS9UcmFuc2xhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBWSxJQUFJLFdBQU0sTUFBTSxDQUFDLENBQUE7QUFFN0Isa0JBQWtCLFFBQWdCO0lBQ2hDLElBQUksQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQztJQUNsRixDQUFFO0lBQUEsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNmLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDbEIsQ0FBQztBQUNILENBQUM7QUFFRDtJQUFBO0lBMkpBLENBQUM7SUE5SFEsMEJBQWMsR0FBckIsVUFBc0IsSUFBWTtRQUNoQyxNQUFNLENBQUMsaUJBQWUsSUFBSSxtQkFBZ0IsQ0FBQztJQUM3QyxDQUFDO0lBaUJNLGlDQUFxQixHQUE1QixVQUE2QixHQUFXO1FBQ3RDLE1BQU0sQ0FBSSxHQUFHLGlDQUE4QixDQUFDO0lBQzlDLENBQUM7SUEyQk0sNENBQWdDLEdBQXZDLFVBQXdDLE1BQWM7UUFDcEQsTUFBTSxDQUFDLFlBQVUsUUFBUSxDQUFDLE1BQU0sQ0FBQywyR0FBc0csQ0FBQztJQUMxSSxDQUFDO0lBRU0saUNBQXFCLEdBQTVCLFVBQTZCLElBQVk7UUFDdkMsTUFBTSxDQUFDLG9CQUFrQixJQUFJLGNBQVcsQ0FBQztJQUMzQyxDQUFDO0lBRU0sa0JBQU0sR0FBYixVQUFjLElBQVk7UUFDeEIsTUFBTSxDQUFDLFlBQVUsSUFBSSxPQUFJLENBQUM7SUFDNUIsQ0FBQztJQUVNLHFCQUFTLEdBQWhCLFVBQWlCLElBQVk7UUFDM0IsTUFBTSxDQUFJLElBQUksd0JBQXFCLENBQUM7SUFDdEMsQ0FB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