import TelegramBot = require('node-telegram-bot-api');
import https = require('https');
import { IChatRelay } from '../../interface/IChatRelay';
import { TELEGRAM_API_KEY, TELEGRAM_CHAT_ID } from '../../const/private/ApiConsts';
import { RelayMessage } from '../../model/RelayMessage';
import { RelayPhoto } from '../../model/RelayPhoto';
import { downloadFileAndTriggerAction } from '../../utils/Files';

export class TelegramRelay extends IChatRelay {
  _bot = new TelegramBot(TELEGRAM_API_KEY, { polling: true });
  _relay: IChatRelay;

  connect(): void {
    this._bot.on('text', msg => this.hookBotRecievedText(msg));
    this._bot.on('photo', msg => this.hookBotRecievedPhoto(msg));
    // this._bot.on('document', msg => this.hookBotRecievedPhoto(msg));
    // this._bot.on('sticker', msg => this.hookBotRecievedPhoto(msg));
    // this._bot.on('video', msg => this.hookBotRecievedPhoto(msg));
    // this._bot.on('voice', msg => this.hookBotRecievedPhoto(msg));
    // this._bot.on('new_chat_title', msg => this.hookBotRecievedPhoto(msg));
  }

  hookBotRecievedText(msg: any): void {
    const chatId = msg.chat.id;
    this.sendMessageToRelay(new RelayMessage(msg.text, msg.from.username));
  }

  hookBotRecievedPhoto(msg: any): void {
    const self = this;
    const url = `https://api.telegram.org/file/bot${TELEGRAM_API_KEY}/${msg.photo[0].file_path}`;

    downloadFileAndTriggerAction(url, (d: Uint8Array) => {
      // Download a file and send it to the relay
      // this.sendImageToRelay(new RelayPhoto({
      //   image: d,
      //   fileName: msg.photo[0].file_path,
      //   from: msg.from.username
      // }));
    });
  }

  recieveMessageFromRelay(message: RelayMessage): void {
    this._bot.sendMessage(TELEGRAM_CHAT_ID, message.getMessage());
  }

  recieveImageFromRelay(message: RelayPhoto): void {
    this._bot.sendPhoto(TELEGRAM_CHAT_ID, message.getFilePath());
  }
}