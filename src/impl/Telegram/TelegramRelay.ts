import TelegramBot = require('node-telegram-bot-api');
import { IChatRelay } from '../../interface/IChatRelay';
import { TELEGRAM_API_KEY, TELEGRAM_CHAT_ID } from '../../const/private/ApiConsts';
import { RelayMessage } from '../../model/RelayMessage';

export class TelegramRelay extends IChatRelay {
  _bot = new TelegramBot(TELEGRAM_API_KEY, { polling: true });
  _relay: IChatRelay;

  connect(): void {
    const self = this;

    this._bot.on('message', function (msg) {
      const chatId = msg.chat.id;
      self.sendMessageToRelay(new RelayMessage(msg.text, msg.from.username));
    });
  }

  recieveMessageFromRelay(message: RelayMessage): void {
    this._bot.sendMessage(TELEGRAM_CHAT_ID, message.getMessage());
  }
}