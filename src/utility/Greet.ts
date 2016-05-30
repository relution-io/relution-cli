export class Greet {

  public static pkg: any = require('./../../package.json');

  static hello(username:string){
//     console.log(`
//  _____      ​_       _   _​                 __   __      __
// |  __ \    | |     | | (_)              /   | |  |    |  |
// | |__) |___| |_   ​_| |_​ _  ___  _ _    |   /  |  |    |  |
// |  ​_  // _​ \ | | | | __| |/ _ \| '_ \  |  |   |  |    |  |
// | | \ \  __/ | |_| | |_| | (_) | | | | |   \  |  |__  |  |
// |_|  \_\___|_|\__,_|\__|_|\___/|_| |_|  \___| |_____| |__|
//     `);
    console.log(`Relution-Cli v${Greet.pkg.version}: `);
    console.log(`Hi ${username}`);
  }

  static bye(username:string) {
    console.log(`Have a Great Day! ${username}`);
  }
}
