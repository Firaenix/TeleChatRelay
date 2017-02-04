import { RelayDocument } from './../model/RelayDocument';
import { RelayMessage } from '../model/RelayMessage';

export abstract class IChatRelay {
  abstract _bot: any;
  _relay: IChatRelay;

  constructor(chatRelay?: IChatRelay) {
    this._relay = chatRelay;
  };

  /**
   * Responsible for setting up all of the connections from the bot
   */
  abstract connect(): void;

  /**
   * Post declaration hook to connect a declared relay to another relay.
   */
  connectToRelay(chatRelay?: IChatRelay) {
    this._relay = chatRelay;
  }

  /*
    Message
  */

  /**
   * This method is to be used when sending a message to a relay's recieveMessage method
   * usage: _bot.on('message', this.sendMessageToRelay(message))
  */
  sendMessageToRelay(message: RelayMessage): void {
    this._relay.recieveMessageFromRelay(message);
  }

  abstract recieveMessageFromRelay(message: RelayMessage): void;

  /*
    Image
  */
  sendImageToRelay(image: RelayDocument): void {
    this._relay.recieveImageFromRelay(image);
  }

  abstract recieveImageFromRelay(image: RelayDocument): void;

  /*
    Video
  */
  sendVideoToRelay(video: RelayDocument): void {
    this._relay.recieveVideoFromRelay(video);
  }

  abstract recieveVideoFromRelay(video: RelayDocument): void;

  /*
    Document
  */
  sendDocumentToRelay(document: RelayDocument): void {
    this._relay.recieveDocumentFromRelay(document);
  }

  abstract recieveDocumentFromRelay(document: RelayDocument): void;

  /*
    Voice
  */
  sendVoiceToRelay(voice: RelayDocument): void {
    this._relay.recieveVoiceFromRelay(voice);
  }

  abstract recieveVoiceFromRelay(voice: RelayDocument): void;
}