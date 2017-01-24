import { ChatRelay } from "../interface/ChatRelay";
import { TELEGRAM_API_KEY } from "../const/private/ApiConsts";
let TelegramBot = require("node-telegram-bot-api");

export class TelegramRelay extends ChatRelay {
  private bot = new TelegramBot(TELEGRAM_API_KEY, { polling: true });

  connect(): void {
    const self = this;

    this.bot.onText(/\/echo (.+)/, function (msg, match) {
      // 'msg' is the received Message from Telegram
      // 'match' is the result of executing the regexp above on the text content
      // of the message

      const chatId = msg.chat.id;
      const resp = match[1]; // the captured "whatever"

      // send back the matched "whatever" to the chat
      // bot.sendMessage(chatId, resp);
      console.log("Echo");
    });

    // Listen for any kind of message. There are different kinds of
    // messages.
    this.bot.on('message', function (msg) {
      const chatId = msg.chat.id;

      // send a message to the chat acknowledging receipt of their message
      // bot.sendMessage(chatId, "Succ my wife");
      console.log(msg);
      // self.sendMessage(msg.text, chatId);
    });
  }

  sendMessage(message: string, chatId: any): boolean {
    this.bot.sendMessage(chatId, message);
    return true;
  }
}