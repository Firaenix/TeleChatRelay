import * as RequestPromise from 'request-promise';
import * as Fsp from 'fs-promise';
import * as Path from 'path';
import * as Stream from 'stream';
import * as Sanitize from 'sanitize-filename';

export namespace FileUtils {
  /**
   * Sanitize file name and return the responsible folder
   * for the requested file
   * TODO: Replace 'files' with a constant eventually
   */
  export function getSaveDirectory(fileName: string = null, type: string = null) {
    if (!fileName || !type) {
      return 'files';
    }

    // Make the file directory if not exists
    if (!Fsp.existsSync('files')) {
      Fsp.mkdir('files');
    }

    // Create the directory just in case it doesnt exist
    const savePath = `files/${type}`;
    if (!Fsp.existsSync(savePath)) {
      Fsp.mkdir(savePath);
    }
    const baseName = Path.basename(Sanitize(fileName));

    return `${savePath}/${baseName}`;
  }
}