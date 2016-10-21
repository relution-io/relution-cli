import {Translation} from './Translation';
import { find, findIndex } from 'lodash';
import { Observer } from '@reactivex/rxjs/dist/cjs/Observer';
import { Observable } from '@reactivex/rxjs/dist/cjs/Observable';
import * as Relution from 'relution-sdk';
import * as chalk from 'chalk';

const pkg = require(`${__dirname}/../../package.json`);
const isOnline = require('is-online');
const emoji = require('node-emoji');
const semverDiff = require('semver-diff');

const diffIcons = {
  'patch': ':warning:',
  'major': ':shit:',
  'minor': ':thumbsdown:',
  'prerelease': ':loudspeaker:',
  'build': ':panda_face:'
};

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
    return Observable.create((ob: Observer<any>) => {
      NpmVersionCheck._postApi().subscribe(
        (resp) => {
          NpmVersionCheck._pkg = resp;
          // console.log('package', resp);
          ob.next(resp);
        },
        e => {
          ob.next({name: pkg.name, version: pkg.version});
        }
      );
    });
  }

  private static diffIcon() {
    const diff = semverDiff(pkg.version, NpmVersionCheck._pkg.version);
    console.log('diff', diff);
    if (!diff || Object.keys(diffIcons).indexOf(diff) === -1) {
      return diffIcons.patch;
    }
    return diffIcons[diff];
  }
  /**
   * simple yes/no
   */
  private static _versionCheck() {
    // console.log('check version', NpmVersionCheck._pkg.version[0] !== pkg.version ? `Version is outdated please update to ${NpmVersionCheck._pkg.version}` : '');
    return NpmVersionCheck._pkg.version[0] !== pkg.version ?
      emoji.emojify(`${NpmVersionCheck.diffIcon()} ${chalk.yellow(Translation.CLI_OUTDATED(NpmVersionCheck._pkg.version))}`) :
      emoji.emojify(`:clap: ${Translation.CLI_UPTODATE(pkg.version)}`);
  }

  public static check() {
    // isOnline((e: any, on: any) => {
    //   console.log(e, on);
    // });
    // return Observable.empty();
    return Observable.create((ob: Observer<any>) => {
      const _isOnline = Observable.bindCallback(isOnline);
      const scriber = _isOnline();
      return scriber.subscribe(
        (online: any) => {
          if (online.length && !online[0] && online[2] === false) {
            ob.next(emoji.emojify(`:waxing_crescent_moon: ${Translation.CLI_OFFLINE}`));
            return ob.complete();
          }
          // console.log('online', online);
          if (!NpmVersionCheck._pkg) {
            // console.log(`no package ${NpmVersionCheck._pkg}`)
            return NpmVersionCheck._package().subscribe(
              (_pkg: any) => {
                console.log(`package`, NpmVersionCheck._pkg);
                ob.next(NpmVersionCheck._versionCheck());
                ob.complete();
              }
            );
          }
          ob.next(NpmVersionCheck._versionCheck());
          ob.complete();
        },
        e => {
          // console.log('offline', e);
          ob.next(emoji.emojify(`:waxing_crescent_moon: ${Translation.CLI_OFFLINE}`));
          ob.complete();
        }
      );
    });
  }
}
