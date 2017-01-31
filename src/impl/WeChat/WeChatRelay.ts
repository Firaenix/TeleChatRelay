import { FileUtils } from '../../utils/FileUtils';
import { MediaMessage, MsgType } from 'wechaty/dist/src/message';
import { RelayMessage } from './../../model/RelayMessage';
import { Wechaty, Message, Room } from 'wechaty';
import { IChatRelay } from '../../interface/IChatRelay';
import { WECHAT_ROOM_NAME } from '../../const/private/ApiConsts';
import { RelayPhoto } from '../../model/RelayPhoto';

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
    this._bot.on('message',  async function(message) { await self.hookRecievedWeChatMessage(message); });
    this._bot.init();
  }

  hookQRCodeScanner(url, code): void {
     console.log(`Scan QR Code to login: ${code}\n${url}`);
  }

  hookLoginNotification(user: any) {
    console.log(`User ${user} logined`);
    this._loggedIn = true;

    // Just call this to notify the bot that we have connected to WeChat
    this.recieveMessageFromRelay(new RelayMessage('Relay Connected', 'Relay'));
  }

  async hookRecievedWeChatMessage(message: Message): Promise<void> {
    //console.log(message);
    // Dont send message if not logged in or message is from the WeChatRelay
    if (!this._loggedIn || message.self()) {
      console.log('Not sending message, was sent by myself');
      return;
    }

    // Keep the connection to the room alive
    this.resolveRoomAndPerformAction()

    switch (message.type()) {
      case MsgType.IMAGE:
        await this.hookWeChatPhoto(message);
        break;
      case MsgType.TEXT:
        this.hookWeChatText(message);
        break;
      case MsgType.EMOTICON:
        this.hookWeChatText(message);
        break;
      default:
        break;
    }
  }

  hookWeChatText(message: Message): void {
    this.sendMessageToRelay(new RelayMessage(message.content(), message.from().name()));
  }

  async hookWeChatPhoto(message: Message): Promise<void> {
    const self = this;

    const readStream = await message.readyStream();
    const filePath = await FileUtils.saveFileFromStream(readStream, message.filename())

    this.sendImageToRelay(new RelayPhoto({
      filePath,
      fileName: message.filename()
    }));

    // message.readyStream()
    //   .then(stream => {
    //     const fileStream = createWriteStream(message.filename())

    //     fileStream.on('open', fd => {
    //       stream.pipe(fileStream)
    //         .on('close', () => {
    //           self.sendImageToRelay(new RelayPhoto({
    //             filePath: message.filename()
    //           }));
    //       });
    //     });
    //   })
    //   .catch(e => console.log('stream error:' + e))
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

  recieveImageFromRelay(message: RelayPhoto): void {
    const msg = new Message();

    //throw new Error('Not implemented yet.');
  }
}