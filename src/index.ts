import { TelegramRelay } from "./impl/Telegram";
import { WeChatRelay } from './impl/WeChat';

let telegramRelay = new TelegramRelay().connect();
console.log("What");
let weChatRelay = new WeChatRelay().connect();