import { request } from 'https';
import { FileslistFormatter } from 'tslint/lib/formatters';
import TelegramBot = require('node-telegram-bot-api');
import { IChatRelay } from '../../interface/IChatRelay';
import { TELEGRAM_API_KEY, TELEGRAM_CHAT_ID } from '../../const/private/ApiConsts';
import { RelayMessage } from '../../model/RelayMessage';
import { RelayPhoto } from '../../model/RelayPhoto';
import { FileUtils } from '../../utils/FileUtils';
import * as RequestPromise from 'request-promise';

export class TelegramRelay extends IChatRelay {
  _bot = new TelegramBot(TELEGRAM_API_KEY, { polling: true });
  _relay: IChatRelay;

  connect(): void {
    const self = this;
    this._bot.on('text', msg => this.hookBotRecievedText(msg));
    this._bot.on('photo', async function(msg) { await self.hookBotRecievedPhoto(msg); });
    // this._bot.on('document', msg => this.hookBotRecievedPhoto(msg));
    // this._bot.on('sticker', msg => this.hookBotRecievedPhoto(msg));
    // this._bot.on('video', msg => this.hookBotRecievedPhoto(msg));
    // this._bot.on('voice', msg => this.hookBotRecievedPhoto(msg));
    // this._bot.on('new_chat_title', msg => this.hookBotRecievedPhoto(msg));

    this.hookLoginMessage();
  }

  hookLoginMessage(): void {
    // Notify telegram bot that relay has connected
    this.recieveMessageFromRelay(new RelayMessage('Relay Connected', 'Relay'));
  }

  hookBotRecievedText(msg: any): void {
    const chatId = msg.chat.id;
    this.sendMessageToRelay(new RelayMessage(msg.text, msg.from.username));
  }

  async hookBotRecievedPhoto(msg: any): Promise<void> {
    const self = this;
    console.log(`https://api.telegram.org/bot${TELEGRAM_API_KEY}/getFile?file_id=${msg.photo[0].file_id}`);
    const getFileResponse = JSON.parse(await RequestPromise.get(`https://api.telegram.org/bot${TELEGRAM_API_KEY}/getFile?file_id=${msg.photo[0].file_id}`));

    const url = `https://api.telegram.org/file/bot${TELEGRAM_API_KEY}/${getFileResponse.result.file_path}`;
    const filePath = await FileUtils.saveFileFromUrl(url, getFileResponse.result.file_path || 'url');

    this.sendImageToRelay(new RelayPhoto({
      fileName: msg.photo[0].file_path,
      filePath
    }));
  }

  recieveMessageFromRelay(message: RelayMessage): void {
    this._bot.sendMessage(TELEGRAM_CHAT_ID, message.getMessage());
  }

  recieveImageFromRelay(message: RelayPhoto): void {
    this._bot.sendPhoto(TELEGRAM_CHAT_ID, message.getFilePath());
  }
}