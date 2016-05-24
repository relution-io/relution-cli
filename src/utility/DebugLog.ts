import * as chalk from 'chalk';
import * as Relution from 'relution-sdk';

export
/**
 * DebugLog
 */

  class DebugLog {

  static log(color: string, message: string, submessage?: any): void {
    if (submessage) {
      console.log(chalk[color](message, submessage));
    }
    console.log(chalk[color](message));
  }

  static error(e: Error): void {
    return DebugLog.log('red', `ERROR ${chalk.green(e.message)}`, e.stack ? e.stack : '');
  }

  static info(message:string, submessage?:any) {
    return DebugLog.log('cyan', message, submessage);
  }

  static warn(message:string, submessage?:any) {
    return DebugLog.log('yellow', `WARNING ${chalk.green(message)}`, submessage);
  }

  static debug(message:string, submessage?:any) {
    return DebugLog.log('magenta', `DEBUG ${chalk.green(message)}`, submessage);
  }
}
