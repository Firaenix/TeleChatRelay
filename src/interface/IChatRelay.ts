import { RelayMessage } from '../model/RelayMessage';

export abstract class IChatRelay {
  abstract _bot: any;
  _relay: IChatRelay;

  constructor(chatRelay?: IChatRelay) {
    this._relay = chatRelay;
  };

  abstract connect(): void;

  connectToRelay(chatRelay?: IChatRelay) {
    this._relay = chatRelay;
  }

  /*
    This method is to be used when sending a message to a relay's recieveMessage method

    usage: _bot.on('message', this.sendMessageToRelay(message))
  */
  sendMessageToRelay(message: RelayMessage): void {
    this._relay.recieveMessageFromRelay(message);
  }

  /*
    This method must be overridden and used to send the given message to the _bot
  */
  abstract recieveMessageFromRelay(message: RelayMessage): void;
}