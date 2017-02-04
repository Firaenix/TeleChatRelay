import { RelayPhoto } from './../model/RelayPhoto';
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

  /**
   * This method is to be used when sending a message to a relay's recieveMessage method
   * usage: _bot.on('message', this.sendMessageToRelay(message))
  */
  sendMessageToRelay(message: RelayMessage): void {
    this._relay.recieveMessageFromRelay(message);
  }

  /**
    This method must be overridden and used to send the given message to the _bot
  */
  abstract recieveMessageFromRelay(message: RelayMessage): void;

  /**
    This method is to be used when sending an image to another relay's recieveImage method
  */
  sendImageToRelay(image: RelayPhoto): void {
    this._relay.recieveImageFromRelay(image);
  }

  /**
    This method must be overridden and used to send the image to the _bot
  */
  abstract recieveImageFromRelay(message: RelayPhoto): void;
}