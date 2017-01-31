import * as RequestPromise from 'request-promise';
import * as Fsp from 'fs-promise';
import * as Path from 'path';
import * as Stream from 'stream';

export module FileUtils {
  export async function saveFileFromUrl(url: string, filename: string): Promise<string> {
    const _savePath = `files`;
    const _createPath = `files/photo`;
    if (!Fsp.existsSync(_createPath)) {
      Fsp.mkdir(_createPath);
    }
    const filePath = `${_savePath}/${filename}`;
    const fileStream = Fsp.createWriteStream(filePath);

    try {
      const response = await RequestPromise.get(url);
      fileStream.write(response);
      fileStream.on('finish', () => fileStream.close());
    }
    catch (e) {
      throw e;
    }

    return filePath;
  }

  export async function saveFileFromStream(readableStream: NodeJS.ReadableStream, filename: string): Promise<string> {
    const _savePath = `files/photo`;
    const _createPath = `files/photo`;
    if (!Fsp.existsSync(_createPath)) {
      Fsp.mkdir(_createPath);
    }
    const filePath = `${_savePath}/${filename}`;
    const fileStream = Fsp.createWriteStream(filePath);

    readableStream.pipe(fileStream);
    fileStream.on('finish', () => fileStream.close());

    return filePath;
  }
}