import {Translation} from './Translation';
import { find, findIndex } from 'lodash';
import { Observer } from '@reactivex/rxjs/dist/cjs/Observer';
import { Observable } from '@reactivex/rxjs/dist/cjs/Observable';
import * as Relution from 'relution-sdk';
import * as chalk from 'chalk';

const pkg = require(`${__dirname}/../../package.json`);
const isOnline = require('is-online');
const emoji = require('node-emoji');


export interface INPMSearch {
  results: Array<{
    name: Array<string>,
    version: Array<string>
  }>;
}

/**
 *
 */
export class NpmVersionCheck {
  private static _web = Relution.web;
  private static _uri = 'http://npmsearch.com/query?q=relution-cli&fields=version,name';
  private static _res: INPMSearch = { results: [] };
  private static _pkg: any = null;
  /**
   * fetch the APi url http://npmsearch.com/query?q=relution-cli&fields=version,name
   * and filter the version
   */
  private static _postApi() {
    return Observable
      .fromPromise(NpmVersionCheck._web.post(NpmVersionCheck._uri))
      .map((resp: INPMSearch) => {
        // console.log(resp.results, pkg);
        NpmVersionCheck._res = resp;
        return find(resp.results, (item) => {
          return item.name.indexOf(pkg.name) !== -1;
        });
      });
  }
  /**
   * get this package from the search looks like
   */
  private static _package() {
    return NpmVersionCheck._postApi();
  }
  /**
   * simple yes/no
   */
  private static _versionCheck() {
    if (!NpmVersionCheck._pkg) {
      return emoji.emojify(':interrobang: Version check failed');
    }
    return NpmVersionCheck._pkg.version[0] !== pkg.version ?
      emoji.emojify(`:warning: ${chalk.yellow(Translation.CLI_OUTDATED(NpmVersionCheck._pkg.version))}`) :
      emoji.emojify(`:clap: ${Translation.CLI_UPTODATE(pkg.version)}`);
  }

  private static offline() {
    return emoji.emojify(`:waxing_crescent_moon: ${Translation.CLI_OFFLINE}`);
  }

  public static check() {
    return Observable.create((ob: Observer<any>) => {
      return isOnline((e: any, on: any) => {
        // console.log('wtf', e, on);
        if (!on) {
          ob.next(NpmVersionCheck.offline());
          ob.complete();
        }

        if (!NpmVersionCheck._pkg) {
          // console.log(`no package ${NpmVersionCheck._pkg}`)
          return NpmVersionCheck._package()
            .subscribe(
              (_pkg: any) => {
                ob.next(NpmVersionCheck._versionCheck());
                ob.complete();
              },
              () => {
                if (!on) {
                  ob.next(NpmVersionCheck.offline()); // https.js throws bad errors
                  ob.complete();
                }
                ob.complete();
              }
            );
        }
        ob.next(NpmVersionCheck._versionCheck());
        ob.complete();
      });
    });
  }
}
