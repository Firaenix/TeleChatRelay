export abstract class IChatRelay {
  abstract _bot: any;
  _relay: IChatRelay;

  constructor(chatRelay?: IChatRelay) {
    this._relay = chatRelay;
  };

  abstract connect(): void;

  connectToRelay(chatRelay?: IChatRelay){
    this._relay = chatRelay;
  }

  abstract sendMessage(message: string, chatId: any): boolean;
}