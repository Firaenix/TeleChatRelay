import { FileUtils } from '../../utils/FileUtils';
import { MediaMessage, MsgType } from 'wechaty/dist/src/message';
import { RelayMessage } from './../../model/RelayMessage';
import { Wechaty, Message, Room } from 'wechaty';
import { IChatRelay } from '../../interface/IChatRelay';
import { WECHAT_ROOM_NAME } from '../../const/private/ApiKeys';
import { RelayDocument } from '../../model/RelayDocument';
import * as Fsp from 'fs-promise';
import { FileTypes } from '../../const/FileTypes';

export class WeChatRelay extends IChatRelay {
  _bot = Wechaty.instance();
  _relay: IChatRelay;

  private _room: Room | null;

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

    this.notifyLoggedIn();
  }

  private async hookRecievedWeChatMessage(message: Message): Promise<void> {
    //console.log(message);
    // Dont send message if not logged in or message is from the WeChatRelay
    if (!this.isLoggedIn || message.self()) {
      console.log('Not sending message, was sent by myself');
      return;
    }

    // Keep the connection to the room alive
    this.resolveRoomAndPerformAction();

    switch (message.type()) {
      case MsgType.TEXT:
        this.hookWeChatText(message);
        break;
      case MsgType.EMOTICON:
        this.hookWeChatEmoticon(message);
        break;
      case MsgType.IMAGE:
        await this.hookWeChatDocument(message, FileTypes.PHOTO);
        break;
      case MsgType.VIDEO:
        await this.hookWeChatDocument(message, FileTypes.VIDEO);
        break;
      case MsgType.VOICE:
        await this.hookWeChatDocument(message, FileTypes.VOICE);
        break;
      default:
        break;
    }
  }

  private hookWeChatText(message: Message): void {
    this.sendMessageToRelay(new RelayMessage(message.content(), message.from().name()));
  }

  private async hookWeChatDocument(message: Message, msgType: FileTypes): Promise<void> {
    const self = this;
    const readStream = await message.readyStream();
    const filePath = FileUtils.getSaveDirectory(message.filename(), FileTypes[msgType]);

    const writeStream = Fsp.createWriteStream(filePath);
    readStream.pipe(writeStream).on('close', () => {
      const relayDoc = new RelayDocument({
        filePath,
        fileName: message.filename()
      });

      switch (msgType) {
        case FileTypes.PHOTO:
          this.sendImageToRelay(relayDoc);
          break;
        case FileTypes.VIDEO:
          this.sendVideoToRelay(relayDoc);
          break;
        case FileTypes.VOICE:
          this.sendVoiceToRelay(relayDoc);
          break;
        default:
          throw new Error(`MsgType ${msgType.toString()} is not supported`);
      }
    });
  }

  private hookWeChatEmoticon(message: Message): void {
    try {
      const emojiRegex = /(cdnurl\s*\=\s*\"(.*)\"\s*designerid)/;
      if (emojiRegex.test(message.content())) {
        const emojiUrl = emojiRegex.exec(message.content())[2];
        this.sendMessageToRelay(new RelayMessage(emojiUrl, message.from().name()));
      }
    } catch (error) {
      console.error(error);
      console.error(error.stack);
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
    if (!this.isLoggedIn) {
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

  recieveImageFromRelay(image: RelayDocument): void {
    this.notImplementedType(image.getSender(), 'photo');
  }

   recieveVideoFromRelay(video: RelayDocument): void {
    this.notImplementedType(video.getSender(), 'video');
  }

   recieveDocumentFromRelay(document: RelayDocument): void {
    this.notImplementedType(document.getSender(), 'document');
  }

   recieveVoiceFromRelay(voice: RelayDocument): void {
    this.notImplementedType(voice.getSender(), 'voice message');
  }

  private notImplementedType(sender: string, typeName: string): void {
    // Dont send messages if we arent logged in yet
    if (!this.isLoggedIn) {
      return;
    }
    // We should make sure we have a room to send the messages to before we send a message
    const self = this;

    this.resolveRoomAndPerformAction(() => {
      const msg = new Message();
      msg.room(this._room);
      msg.content(`${sender}: Tried to send a ${typeName}. Sending ${typeName}s is not supported yet. 不支持的文件类型。`);

      self._bot.send(msg);
    });
  }
}