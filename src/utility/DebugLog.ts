import * as Relution from 'relution-sdk';
import * as chalk from 'chalk';

/**
 * DebugLog
 */
export class DebugLog {
  static get withStack(): boolean {
    return Relution.debug.enabled; // use --debug command line switch to enable this
  };

  static badge(label: string, color = 'green'): string {
    if (chalk.supportsColor) {
      return '';
    }
    return chalk.bgBlack(chalk[color](` ${label} : `));
  }
  static log(color: string, message: string, submessage?: any): void {
    if (submessage) {
      console.log(chalk[color](message, submessage));
    } else {
      console.log(chalk[color](message));
    }
  }

  static error(e: Error): void {
    return DebugLog.log('red', `${DebugLog.badge('ERROR', 'red')}${chalk.green(e.message)}`, e.stack && DebugLog.withStack ? e.stack : '');
  }

  static info(message: string, submessage?: any) {
    return DebugLog.log('cyan', `${DebugLog.badge('INFO', 'cyan')}${message}`, submessage);
  }

  static warn(message: string, submessage?: any) {
    return DebugLog.log('yellow', `${DebugLog.badge('WARNING', 'yellow')}${chalk.green(message)}`, submessage);
  }

  static debug(message: string, submessage?: any) {
    return DebugLog.log('magenta', `${DebugLog.badge('DEBUG', 'magenta')}${chalk.green(message)}`, submessage);
  }
}
