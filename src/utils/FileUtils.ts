import * as RequestPromise from 'request-promise';
import * as Fsp from 'fs-promise';
import * as Path from 'path';
import * as Stream from 'stream';
import * as Sanitize from 'sanitize-filename';

export module FileUtils {
  export function getSaveDirectory(fileName: string, type: string) {
    // Create the directory just in case it doesnt exist
    const savePath = `files/${type}`;
    if (!Fsp.existsSync(savePath)) {
      Fsp.mkdir(savePath);
    }
    const baseName = Path.basename(Sanitize(fileName));

    return `${savePath}/${baseName}`;
  }
}