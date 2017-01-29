export interface PhotoData {
  image: Uint8Array;
  fileName?: string;
  from?: string;
}

export class RelayPhoto {
  private _imageBytes: Uint8Array;
  private _fileName: string;
  private _from: string;

  constructor(photoData: PhotoData) {
    this._imageBytes = photoData.image;
    this._fileName = photoData.fileName;
    this._from = photoData.from;
  }

  getImage(): Uint8Array {
    return this._imageBytes;
  }

  getSender(): string {
    return this._from;
  }

  getFilename(): string {
    return this._fileName;
  }
}