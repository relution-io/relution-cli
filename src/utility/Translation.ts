export class Translation {

  static PRESS_ENTER = ' or press enter';
  static QUIT = 'quit';
  static ENTER_SOMETHING = `Please enter a `;
  static TAKE_ME_OUT: string = 'Take me out of here';
  static NOT_VALID: string = `Your Input is not valid`;
  static EXIT_TO_HOME: string = 'Exit to Home';
  static NPM_INSTALL = `Start npm install this take a while`;
  /**
   * Server Command
   */
  static SERVER_ADD: string = 'Add a new Server to the config';
  static SERVER_LIST: string = 'List all available Server from config';
  static SERVER_RM: string = 'Remove a Server from the config';
  static SERVER_UPDATE: string = 'Update a exist server from the Server list';
  /**
   * New Command
   */
  static NEW_CREATE = `create a new Project in Folder`;
  /**
   * Deploy Command
   */
  static DEPLOY_PUBLISH = `deploy your Baas to the server`;
  static DEPLOY_NO_ORGA = `Organization has no defaultRoles. This will cause problems creating applications. Operation not permitted.`;
  /**
   * Connection Command
   */
  static CONNECTION_ADD_LABEL = `Add new Connection`;
  static CONNECTION_ADD_DESCRIPTION = `Create a new connection`;
  static CONNECTION_API_LIST_LABEL= `Add some calls from you deployed Connection`;
  static CONNECTION_API_LIST_DESCRIPTION = `Add some calls to the exists Connection`;
  static CONNECTION_ADD_CONNECTION_BEFORE = `Please add first a Connection for this feature.`;
  static CONNECTION_ADD_SERVER_BEFORE = `Please add first a Server to create a Connection.`;

  /**
   * Environment
   */
  static ENV_UPDATE = 'Add a new key value pair to your Environment.';
  static ENV_COPY = 'copy a exist Environment';
  static ENV_IS_CREATED(name: string): string {
    return `Environment ${name} is generated.`;
  }
  static ENV_UPDATE_COMPLETE = `Update complete`;
  static ENV_ADD_FIRSTLY = `Please add an Environment firstly!`;

  static FOLDER_IS_NOT_A_RELUTION_PROJECT(folder: string): string {
    return `The folder "${folder}" is not a Relution project. Please read the manual "How to migrate exists Project into a relution Project".`;
  }

  static LIST_AVAILABLE_CONFIG(name: string ): string {
    return `List available ${name} configs.`;
  }

  static SELECT(name: string): string {
    return `Select ${name} :`;
  }

  static NOT_EMPTY(name: string): string {
    return `${name} can not be empty`;
  }

  static ENTER_SOMETHING_LABEL(name: string) {
    return `Please enter ${name}`;
  }

  static CHOOSE_LIST(name: string): string {
    return `Please choose a ${name}:`;
  }

  static YOU_MOUST_CHOOSE(name: string): string {
    return `You must choose at least one ${name}.`;
  }

  static LIST_COMMAND(name: string): string {
    return `List the ${name} Command`;
  }

  static FOLDER_NOT_EXIST(folder: string): string {
    return `Folder ${folder} not exists!`;
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
    return `\n ${type} "${name}" already exist please choose another one`;
  }

  static NOT_ALLOWED(name: string, pattern: RegExp) {
    return `\n Name ${name} has wrong character allowed only ${pattern}`;
  }

  static FOLDER_NOT_EMPTY(path: string): string {
    return `${path} is not empty please clean it up before!`;
  }

  static ADD_ANOTHER(name: string): string {
    return `You want to add another ${name} ?`;
  }

  static ADD_ALSO(name: string): string {
    return `You want to add also ${name} ?`;
  }
}
