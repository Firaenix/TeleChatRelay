export interface PhotoData {
  filePath: string;
  url?: string;
  fileName?: string;
  from?: string;
}

export class RelayPhoto {
  private _filePath: string;
  private _url: string;
  private _fileName: string;
  private _from: string;


  constructor(photoData: PhotoData) {
    this._url = photoData.url;
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

  getUrlMessage(): string {
    return `${this._from}: ${this._url}`;
  }

  getUrl(): string {
    return this._url;
  }
}