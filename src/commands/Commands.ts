import {Home} from './home/Home';
let v = new Home();

export class Commands{
  /**
   * home command
   */
  public static home: Home = new Home();
  /**
   * return the available root Commands
   */
  static roots(){
    return [
      this.home.name,
      'quit',
      'help'
    ];
  }
}
