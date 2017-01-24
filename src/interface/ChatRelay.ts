export abstract class ChatRelay {
  connect() : void {

  }

  sendMessage(message: string, chatId: any) : boolean {
    return false;
  }
}