/// <reference path="../../ambients/node-telegram-bot-api.d.ts"/>
import TelegramBot = require('node-telegram-bot-api');
import { RequestOptions } from 'http';
import { IChatRelay } from '../../interface/IChatRelay';
import { TELEGRAM_API_KEY, TELEGRAM_CHAT_ID } from '../../const/private/ApiConsts';
import { RelayMessage } from '../../model/RelayMessage';
import { RelayPhoto } from '../../model/RelayPhoto';
import { FileUtils } from '../../utils/FileUtils';
import * as RequestPromise from 'request-promise';
import * as Fsp from 'fs-promise';
import * as request from 'request';

export class TelegramRelay extends IChatRelay {
  _bot = new TelegramBot(TELEGRAM_API_KEY, { polling: true });
  _relay: IChatRelay;

  /*
   * Responsible for setting up all of the connections from the bot
   */
  connect(): void {
    const self = this;
    this._bot.on('text', (msg: Message) => this.hookBotRecievedText(msg));
    this._bot.on('photo', async function(msg: Message) { await self.hookBotRecievedDocument(msg, 'photo'); });
    //this._bot.on('document', msg => this.hookBotRecievedDocument(msg, 'document'));
    this._bot.on('sticker', (msg: Message) => {
      this.hookBotRecievedSticker(msg);
    });
    //this._bot.on('video', msg => this.hookBotRecievedDocument(msg, 'video'));
    //this._bot.on('voice', msg => this.hookBotRecievedDocument(msg, 'voice'));
    this._bot.on('new_chat_title', (msg: Message) => this.hookChangeChatTitle(msg));

    this.hookLoginMessage();
  }

  private hookLoginMessage(): void {
    // Notify telegram bot that relay has connected
    this.recieveMessageFromRelay(new RelayMessage('Relay has logged in', 'Relay'));
  }

  private hookChangeChatTitle(msg: Message) {
    this.sendMessageToRelay(new RelayMessage(msg.text, 'Relay'));
  }

  private hookBotRecievedText(msg: Message): void {
    const chatId = msg.chat.id;
    this.sendMessageToRelay(new RelayMessage(msg.text, msg.from.username));
  }

  /*
  * In the mean time, we can just send as an emoji, download and send picture later
  */
  private hookBotRecievedSticker(msg: Message): void {
    const chatId = msg.chat.id;
    this.sendMessageToRelay(new RelayMessage(`sticker - ${msg.sticker.emoji}`, msg.from.username));
  }

  private async hookBotRecievedDocument(msg: Message, type: string): Promise<void> {
    const self = this;
    const getUrl = `https://api.telegram.org/bot${TELEGRAM_API_KEY}/getFile?file_id=${msg.photo[1].file_id}`;
    const getFileResponse = JSON.parse(await RequestPromise.get(getUrl));

    const downloadUrl = `https://api.telegram.org/file/bot${TELEGRAM_API_KEY}/${getFileResponse.result.file_path}`;

    try {
      // Download file as text
      const path = FileUtils.getSaveDirectory(getFileResponse.result.file_path, 'photo');
      request(downloadUrl, { encoding: null }).pipe(Fsp.createWriteStream(path));

      this.sendImageToRelay(new RelayPhoto({
        fileName: msg.photo[0].file_path,
        filePath: path,
        url: downloadUrl,
        from: msg.from.username
      }));
    } catch (error) {
      console.log(error);
    }
  }

  recieveMessageFromRelay(message: RelayMessage): void {
    this._bot.sendMessage(TELEGRAM_CHAT_ID, message.getMessage());
  }

  recieveImageFromRelay(message: RelayPhoto): void {
    this._bot.sendPhoto(TELEGRAM_CHAT_ID, message.getFilePath());
  }
}