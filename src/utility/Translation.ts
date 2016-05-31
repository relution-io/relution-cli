export class Translation {

  static PRESS_ENTER = ' or press enter';
  static QUIT = 'quit';
  static ENTER_SOMETHING = `Please enter a `;
  static TAKE_ME_OUT: string = 'Take me out of here';
  static NOT_VALID: string = `Your Input is not valid`;
  static EXIT_TO_HOME: string = 'Exit to Home';
  static SERVER_ADD: string = 'Add a new Server to the config';
  static SERVER_LIST: string = 'List all available Server from config';
  static SERVER_RM: string = 'Remove a Server from the config';
  static SERVER_UPDATE: string = 'Update a exist server from the Server list';
  static NEW_CREATE = `create a new Project in Folder`;
  static DEPLOY = `deploy your Baas to the server`;
  static NPM_INSTALL = `Start npm install this take a while`;

  static FOLDER_IS_NOT_A_RELUTION_PROJECT(folder: string): string {
    return `The folder "${folder}" is not a Relution project. Please read the manual "How to migrate exists Project into a relution Project".`;
  }

  static SELECT(name: string): string {
    return `Select ${name} :`;
  }

  static NOT_EMPTY(name: string): string {
    return `${name} can not be empty`;
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
