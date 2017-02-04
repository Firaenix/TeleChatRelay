import { FileUtils } from '../../utils/FileUtils';
import { MediaMessage, MsgType } from 'wechaty/dist/src/message';
import { RelayMessage } from './../../model/RelayMessage';
import { Wechaty, Message, Room } from 'wechaty';
import { IChatRelay } from '../../interface/IChatRelay';
import { WECHAT_ROOM_NAME } from '../../const/private/ApiConsts';
import { RelayDocument } from '../../model/RelayDocument';
import * as Fsp from 'fs-promise';

export class WeChatRelay extends IChatRelay {
  _bot = Wechaty.instance();
  _relay: IChatRelay;

  private _room: Room | null;
  private _loggedIn: boolean = false;

  connect(): void {
    console.log('Connecting to WeChat');
    const self = this;
    this._bot.on('scan', (url, code) => self.hookQRCodeScanner(url, code));
    this._bot.on('login', user => self.hookLoginNotification(user));
    this._bot.on('message',  async function(message) { await self.hookRecievedWeChatMessage(message); });
    this._bot.init();
  }

  /*
  * Hooks
  */

  private hookQRCodeScanner(url, code): void {
     console.log(`Scan QR Code to login: ${code}\n${url}`);
  }

  private hookLoginNotification(user: any) {
    console.log(`User ${user} logined`);
    this._loggedIn = true;

    // Just call this to notify the bot that we have connected to WeChat
    this.recieveMessageFromRelay(new RelayMessage('Relay has logged in', 'Relay'));
  }

  private async hookRecievedWeChatMessage(message: Message): Promise<void> {
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
        this.hookWeChatEmoticon(message);
        break;
      default:
        break;
    }
  }

  private hookWeChatText(message: Message): void {
    this.sendMessageToRelay(new RelayMessage(message.content(), message.from().name()));
  }

  private async hookWeChatPhoto(message: Message): Promise<void> {
    try {
      const readStream = await message.readyStream();
      const filePath = FileUtils.getSaveDirectory(message.filename(), 'photo');

      const writeStream = Fsp.createWriteStream(filePath);
      readStream.pipe(writeStream).on('close', () => {
        this.sendImageToRelay(new RelayDocument({
          filePath,
          fileName: message.filename()
        }));
      });
    } catch (error) {
      console.log(error);
    }
  }

  private hookWeChatEmoticon(message: Message): void {
    try {
      const emojiRegex = /(cdnurl\s*\=\s*\"(.*)\"\s*designerid)/;
      if (emojiRegex.test(message.content())) {
        const emojiUrl = emojiRegex.exec(message.content())[2];
        this.sendMessageToRelay(new RelayMessage(emojiUrl, message.from().name()));
      }
    } catch (error) {
      console.log(error);
    }
  }

  private resolveRoomAndPerformAction(action?: () => any): void {
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

  /*
  * External Relay Methods
  */

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

  recieveImageFromRelay(message: RelayDocument): void {
    // Dont send messages if we arent logged in yet
    if (!this._loggedIn) {
      return;
    }
    // We should make sure we have a room to send the messages to before we send a message
    const self = this;

    this.resolveRoomAndPerformAction(() => {
      const msg = new Message();
      msg.room(this._room);
      msg.content(`${message.getSender()}: Tried to send photo/document. sendImage is not supported yet`);

      self._bot.send(msg);
    });
  }

   recieveVideoFromRelay(video: RelayDocument): void {
    throw new Error('Not implemented yet.');
  }

   recieveDocumentFromRelay(document: RelayDocument): void {
    throw new Error('Not implemented yet.');
  }
}