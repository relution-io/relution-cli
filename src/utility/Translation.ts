import * as path from 'path';

function relative(pathname: string) {
  try {
    return path.relative(process.cwd(), pathname) || path.basename(pathname) || '.';
  } catch (error) {
    return pathname;
  }
}

export class Translation {

  static PRESS_ENTER = ' or press enter';
  static QUIT = 'back';
  static ENTER_SOMETHING = `Please enter a `;
  static CANCEL: string = 'Cancel';
  static NOT_VALID: string = `Your Input is not valid`;
  static EXIT_TO_HOME: string = 'Back to Home';
  static NPM_INSTALL = `Start npm install this take a while`;

  static GENERAL_HELP_TABLEHEADERS = ['Group', 'Command', 'Parameters', 'Description'];

  /**
   * Server Command
   */
  static SERVER_ADD: string = 'Add a new Server to the config';
  static SERVER_LIST: string = 'List all available Server from config';
  static SERVER_LIST_TABLEHEADERS = ['Server', 'URL', 'Default', 'Username'];
  static SERVER_RM: string = 'Remove a Server from the config';
  static SERVER_UPDATE: string = 'Update a exists server from the Server list';
  static SERVER_CLIENTCERT: string = 'Specify a client certificate for contacting a Server';
  static SERVER_CLIENTCERT_NOT_FOUND = 'File not found.';

  /*
   * Environment
   */
  static ENV_LIST_TABLEHEADERS = ['Environment Name'];
  static ENV_UPDATE = 'Add a new key value pair to your Environment.';
  static ENV_COPY = 'copy a exists Environment';
  static ENV_IS_CREATED(name: string): string {
    return `Environment ${name} is generated.`;
  }
  static ENV_UPDATE_COMPLETE = `Update complete`;
  static ENV_ADD_FIRSTLY = `Please add an Environment firstly!`;

  /*
   * New Command
   */
  static NEW_CREATE = `create a new Project in Folder`;

  /*
   * Deploy Command
   */
  static DEPLOY_PUBLISH = `deploy your Baas to the server`;
  static DEPLOY_NO_ORGA = `Organization has no defaultRoles. This will cause problems creating applications. Operation not permitted.`;
  static DEPLOY_SUCCESS = 'Deployment completed.';
  static DEPLOY_FAILED = 'Deployment failed!';
  static DEPLOY_APPURL = 'Your application is available at';

  /*
   * Connection Command
   */
  static CONNECTION_ADD_LABEL = `new connection`;
  static CONNECTION_ADD_DESCRIPTION = `Create a new connection.`;
  static CONNECTION_API_LIST_LABEL = `assign calls`;
  static CONNECTION_API_LIST_DESCRIPTION = `assign some calls to the choosen connection.`;
  static CONNECTION_ADD_CONNECTION_BEFORE = `Please add first a connection for this feature.`;
  static CONNECTION_ADD_SERVER_BEFORE = `Please add first a Server to create a Connection.`;
  static CONNECTION_LIST_TABLEHEADERS = ['Connection Name'];

  /*
   * Push
   */
  static PUSH_LIST_TABLEHEADERS = ['Push'];

  static FOLDER_IS_NOT_A_RELUTION_PROJECT(folder: string): string {
    return `Folder ${relative(folder)} does not contain a Relution project, see "How to migrate existing Project into a Relution Project".`;
  }

  static LIST_AVAILABLE_CONFIG(name: string ): string {
    return `List available ${name} configs.`;
  }

  static SELECT(name: string): string {
    return `Select ${name} :`;
  }

  static NOT_EMPTY(name: string): string {
    return `${name} must be specified.`;
  }

  static ENTER_SOMETHING_LABEL(name: string) {
    return `Please enter ${name}`;
  }

  static CHOOSE_LIST(name: string): string {
    return `Please choose a ${name}:`;
  }

  static YOU_MUST_CHOOSE(name: string): string {
    return `You must choose at least one ${name}.`;
  }

  static HELP_COMMAND(name: string): string {
    return `Help on ${name}`;
  }

  static FOLDER_NOT_EXIST(folder: string): string {
    return `Folder ${relative(folder)} does not exist!`;
  }
  static RH_DESCRIPTION(name: string): string {
    return `Auto Generated Description for ${name}.`;
  }

  static HJSON_WRITTEN(name: string): string {
    return Translation.WRITTEN(`${name}.hjson`);
  }

  static FOLDER_WRITTEN(name: string): string {
    return Translation.WRITTEN(name, 'Folder');
  }

  static FOLDERS_WRITTEN(name: string): string {
    return Translation.WRITTEN(name, 'Folders');
  }

  static FILES_WRITTEN(name: string): string {
    return Translation.WRITTEN(name, 'Files');
  }

  static WRITTEN(name: string, type = 'File'): string {
    return `${type} "${name}" are created`;
  }

  static ALREADY_EXIST(name: string, type = 'Name'): string {
    return `\n ${type} "${name}" already exists please choose another one`;
  }

  static NOT_ALLOWED(name: string, pattern: RegExp) {
    return `\n Name ${name} has wrong character allowed only ${pattern}`;
  }

  static FOLDER_NOT_EMPTY(path: string): string {
    return `Folder ${relative(path)} is not empty.`;
  }

  static ADD_ANOTHER(name: string): string {
    return `You want to add another ${name} ?`;
  }

  static ADD_ALSO(name: string): string {
    return `You want to add also ${name} ?`;
  }
}
