let credential = '';

export class Translation{
  static PRESS_ENTER = ' or press enter';
  static QUIT = 'quit';
  static ENTER_SOMETHING = `Please enter a `;
  static TAKE_ME_OUT:string = 'Take me out of here';
  static NOT_VALID:string = `Your Input is not valid`;

  static SELECT(name:string):string{
    return `Select ${name}`;
  }

  static YOU_MOUST_CHOOSE(name:string):string {
    return `You must choose at least one ${name}.`;
  }

  static LIST_COMMAND(name:string):string{
    return `List the ${name} Command`;
  }
}
