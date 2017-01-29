import { Wechaty } from 'wechaty';
import { IChatRelay } from '../../interface/IChatRelay';

export class WeChatRelay extends IChatRelay {
  _bot: any;
  _relay: IChatRelay;

  connect(): void {
    console.log('Connecting to WeChat');
    const self = this;

    Wechaty.instance() // Singleton
      .on('scan', (url, code) => self.scan(url, code))
      .on('login',       user => console.log(`User ${user} logined`))
      .on('message',  message => console.log(`Message: ${message}`))
      .init();
  }

  scan(url, code): void {
     console.log(`Scan QR Code to login: ${code}\n${url}`);
  }

  sendMessage(message: string, chatId: any): boolean {
    return false;
  }
}