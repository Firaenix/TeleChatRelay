import { Md5 } from 'ts-md5/dist/md5';

export class RelayMessage {
  private _hash: string | Int32Array;
  private _message: string;
  private _from: string;

  constructor(message: string, from: string) {
    this._message = message;
    this._from = from;

    this._hash = Md5.hashStr(message);
  }

  getMessage(): string {
    return `${this._from}: ${this._message}`;
  }

  getHash(): string | Int32Array {
    return this._hash;
  }

  isEqualTo(otherMessage: RelayMessage) {
    return this._hash === otherMessage.getHash()
  }
}