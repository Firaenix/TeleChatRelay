import { TelegramRelay } from './impl/Telegram/TelegramRelay';
import { WeChatRelay } from './impl/WeChat/WeChatRelay';

try {
  let telegramRelay = new TelegramRelay();
  let weChatRelay = new WeChatRelay(telegramRelay);

  telegramRelay.connectToRelay(weChatRelay);

  weChatRelay.connect();
  telegramRelay.connect();
} catch (error) {
  console.log(error);
}