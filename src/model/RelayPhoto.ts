export interface PhotoData {
  filePath: string;
  fileName?: string;
  from?: string;
}

export class RelayPhoto {
  private _filePath: string;
  private _fileName: string;
  private _from: string;

  constructor(photoData: PhotoData) {
    this._filePath = photoData.filePath;
    this._fileName = photoData.fileName;
    this._from = photoData.from;
  }

  getFilePath(): string {
    return this._filePath;
  }

  getSender(): string {
    return this._from;
  }

  getFilename(): string {
    return this._fileName;
  }
}