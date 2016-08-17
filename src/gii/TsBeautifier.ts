import * as tsfmt from "typescript-formatter";
import {Observable} from '@reactivex/rxjs';
export class TsBeautifier {
  /**
   * @link [tsfmt](https://github.com/vvakame/typescript-formatter)
   */
  public static options = {
    dryRun: false,
    replace: true,
    verify: false,
    tslint: true,
    tsconfig: false,
    editorconfig: true,
    tsfmt: true
  };

  /**
   * fix the ts files with editorconfig and
   */
  public static format(filePaths: string[], options = TsBeautifier.options) {
    return Observable.fromPromise(tsfmt.processFiles(filePaths, options));
  }
}
