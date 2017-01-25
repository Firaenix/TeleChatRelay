import { TelegramRelay } from "./impl/Telegram/Telegram";
import { WeChatRelay } from './impl/WeChat/WeChat';

let telegramRelay = new TelegramRelay();
let weChatRelay = new WeChatRelay(telegramRelay);

telegramRelay.connectToRelay(weChatRelay);

telegramRelay.connect();
weChatRelay.connect();