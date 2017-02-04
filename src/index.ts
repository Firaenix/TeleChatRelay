import { RelayMessage } from './model/RelayMessage';
import { TelegramRelay } from './impl/Telegram/TelegramRelay';
import { WeChatRelay } from './impl/WeChat/WeChatRelay';
import * as Fsp from 'fs-promise';
import { FileUtils } from './utils/FileUtils';
import ON_DEATH = require('death');

try {
  let telegramRelay = new TelegramRelay();
  let weChatRelay = new WeChatRelay(telegramRelay);

  telegramRelay.connectToRelay(weChatRelay);

  weChatRelay.connect();
  telegramRelay.connect();

  ON_DEATH((signal, err) => {
    // Clean up file directory
    const fileDir = FileUtils.getSaveDirectory();
    Fsp.remove(fileDir).then(() => process.exit());
  });
} catch (error) {
  console.log(error);
}