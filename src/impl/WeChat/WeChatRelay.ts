import { RelayMessage } from './../../model/RelayMessage';
import { Wechaty, Message, Room } from 'wechaty';
import { IChatRelay } from '../../interface/IChatRelay';
import { WECHAT_ROOM_NAME } from '../../const/private/ApiConsts';

export class WeChatRelay extends IChatRelay {
  _bot = Wechaty.instance();
  _relay: IChatRelay;

  private _room: Room|null;
  private _loggedIn: boolean = false;

  connect(): void {
    console.log('Connecting to WeChat');
    const self = this;
    this._bot.on('scan', (url, code) => self.hookQRCodeScanner(url, code));
    this._bot.on('login', user => self.hookLoginNotification(user));
    this._bot.on('message',  message => self.hookRecievedWeChatMessage(message));
    this._bot.init();
  }

  hookQRCodeScanner(url, code): void {
     console.log(`Scan QR Code to login: ${code}\n${url}`);
  }

  hookLoginNotification(user: any) {
    console.log(`User ${user} logined`);
    this._loggedIn = true;
  }

  hookRecievedWeChatMessage(message: Message): void {
    console.log(message);
    // Dont send message if not logged in or message is from the WeChatRelay
    if (!this._loggedIn || message.self()) {
      console.log('Not sending message, was sent by myself');
      return;
    }

    // Keep the connection to the room alive
    this.resolveRoomAndPerformAction()
    this.sendMessageToRelay(new RelayMessage(message.content(), message.from().name()));
  }

  resolveRoomAndPerformAction(action?: () => any): void {
    if (!this._room) {
      Room.find({ topic: WECHAT_ROOM_NAME }).then((result) => {
        this._room = result;
        if (action) {
          action();
        }
      });
    }
    else {
      if (action) {
        action();
      }
    }
  }

  recieveMessageFromRelay(message: RelayMessage): void {
    // Dont send messages if we arent logged in yet
    if (!this._loggedIn) {
      return;
    }
    // We should make sure we have a room to send the messages to before we send a message
    const self = this;

    this.resolveRoomAndPerformAction(() => {
      const msg = new Message();
      msg.room(this._room);
      msg.content(message.getMessage());

      self._bot.send(msg);
    });
  }
}