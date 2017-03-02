/// <reference path="../../ambients/node-telegram-bot-api.d.ts"/>
import TelegramBot = require('node-telegram-bot-api');
import { RequestOptions } from 'http';
import { IChatRelay } from '../../interface/IChatRelay';
import { TELEGRAM_API_KEY, TELEGRAM_CHAT_ID } from '../../const/private/ApiConsts';
import { RelayMessage } from '../../model/RelayMessage';
import { RelayDocument } from '../../model/RelayDocument';
import { FileUtils } from '../../utils/FileUtils';
import * as RequestPromise from 'request-promise';
import * as Fsp from 'fs-promise';
import * as request from 'request';
import { FileTypes } from '../../const/FileTypes';

export class TelegramRelay extends IChatRelay {
  _bot = new TelegramBot(TELEGRAM_API_KEY, { polling: true });
  _relay: IChatRelay;

  /**
   * Responsible for setting up all of the connections from the bot
   */
  connect(): void {
    const self = this;
    this._bot.on('text', (msg: Message) => this.hookBotRecievedText(msg));
    this._bot.on('sticker', (msg: Message) => this.hookBotRecievedSticker(msg));

    this._bot.on('photo', async function(msg: Message) { await self.hookBotRecievedDocument(msg, FileTypes.PHOTO); });
    this._bot.on('document', async function(msg: Message) { await self.hookBotRecievedDocument(msg, FileTypes.DOCUMENT); });
    this._bot.on('video', async function(msg: Message) { await self.hookBotRecievedDocument(msg, FileTypes.VIDEO); });
    this._bot.on('voice', async function(msg: Message) { await self.hookBotRecievedDocument(msg, FileTypes.VOICE); });

    this._bot.on('new_chat_title', (msg: Message) => this.hookChangeChatTitle(msg));

    this.hookLoginMessage();
  }

  /*
  * Hooks
  */

  private hookLoginMessage(): void {
    this.notifyLoggedIn();
  }

  private hookChangeChatTitle(msg: Message) {
    this.sendMessageToRelay(new RelayMessage(msg.text, 'Relay'));
  }

  private hookBotRecievedText(msg: Message): void {
    const chatId = msg.chat.id;

    if (msg.reply_to_message) {
      this.handleReplyMessages(msg);
    }
    else {
      this.sendMessageToRelay(new RelayMessage(msg.text, msg.from.username || `${msg.from.first_name} ${msg.from.last_name}`));
    }
  }

  /**
  * In the mean time, we can just send as an emoji, download and send picture later
  */
  private hookBotRecievedSticker(msg: Message): void {
    const chatId = msg.chat.id;
    this.sendMessageToRelay(new RelayMessage(`sticker - ${msg.sticker.emoji}`, msg.from.username || `${msg.from.first_name} ${msg.from.last_name}`));
  }

  private async hookBotRecievedDocument(msg: Message, type: FileTypes): Promise<void> {
    interface DownloadObject {
      downloadUrl: string;
      filePath: string;
    }

    /**
     * file parameter must
     */
    const downloadAndReturnPath = async (file: IFile): Promise<DownloadObject> => {
      // Resolve the download URL
      const getUrl = `https://api.telegram.org/bot${TELEGRAM_API_KEY}/getFile?file_id=${file.file_id}`;
      const getFileResponse = JSON.parse(await RequestPromise.get(getUrl));

      // Download from the path
      const downloadUrl = `https://api.telegram.org/file/bot${TELEGRAM_API_KEY}/${getFileResponse.result.file_path}`;
      const path = FileUtils.getSaveDirectory(getFileResponse.result.file_path, FileTypes[type]);
      request(downloadUrl, { encoding: null }).pipe(Fsp.createWriteStream(path));

      return {
        downloadUrl: downloadUrl,
        filePath: path
      };
    }

    const compileMessage = (filename: string, downloadObj: DownloadObject): RelayDocument => {
      return new RelayDocument({
        fileName: filename,
        filePath: downloadObj.filePath,
        url: downloadObj.downloadUrl,
        from: msg.from.username
      });
    };

    switch (type) {
      case FileTypes.PHOTO:
        const photo = msg.photo[1];

        this.sendImageToRelay(compileMessage(photo.file_path, await downloadAndReturnPath(photo)));
        break;
      case FileTypes.VIDEO:
        const video = msg.video;

        this.sendVideoToRelay(compileMessage(video.file_path, await downloadAndReturnPath(video)));
        break;
      case FileTypes.DOCUMENT:
        const doc = msg.document;

        this.sendDocumentToRelay(compileMessage(doc.file_path, await downloadAndReturnPath(doc)));
        break;
      case FileTypes.VOICE:
        const voice = msg.voice;

        this.sendVoiceToRelay(compileMessage(voice.file_path, await downloadAndReturnPath(voice)));
        break;
      default:
        throw new Error(`Type is ${type}, not supported`);
    }
  }

  private handleReplyMessages(msg: Message): void {
    const replyUser: string = msg.from.username || `${msg.from.first_name} ${msg.from.last_name}`;

    const origUser: string = msg.reply_to_message.from.username || `${msg.from.first_name} ${msg.from.last_name}`;
    const origMessage: RelayMessage = new RelayMessage(msg.reply_to_message.text, origUser);

    const replyText: string = `Response to: "${origMessage.getMessage()}"\n-> "${msg.text}"`;
    this.sendMessageToRelay(new RelayMessage(replyText, replyUser));
  }

  /*
  * External Relay Methods
  */

  recieveMessageFromRelay(message: RelayMessage): void {
    this._bot.sendMessage(TELEGRAM_CHAT_ID, message.getMessage());
  }

  recieveImageFromRelay(image: RelayDocument): void {
    this._bot.sendPhoto(TELEGRAM_CHAT_ID, image.getFilePath());
  }

   recieveVideoFromRelay(video: RelayDocument): void {
    this._bot.sendVideo(TELEGRAM_CHAT_ID, video.getFilePath());
  }

   recieveDocumentFromRelay(document: RelayDocument): void {
    this._bot.sendDocument(TELEGRAM_CHAT_ID, document.getFilename());
  }

   recieveVoiceFromRelay(voice: RelayDocument): void {
    this._bot.sendVoice(TELEGRAM_CHAT_ID, voice.getFilename());
  }
}