let credential = '';

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

  static SELECT(name: string): string {
    return `Select ${name}`;
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

  static WRITTEN(name: string, type: string = 'File'): string {
    return `${type} "${name}" are created`;
  }
  static ALREADY_EXIST(name: string, type: string = 'Name'): string {
    return `\n ${type} "${name}" already exist please choose another one`;
  }

  static NOT_ALLOWED(name: string, pattern: RegExp) {
    return `\n Name ${name} has wrong character allowed only ${pattern}`;
  }

  static FOLDER_NOT_EMPTY(path: string): string {
    return `${path} is not empty please clean it up before!`;
  }
}
