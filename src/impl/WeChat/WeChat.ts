import { IChatRelay } from '../../interface/IChatRelay';
import { WECHAT_API_KEY, WECHAT_API_SECRET } from '../../const/private/ApiConsts';
import wechat = require('wechat');
import TokenManager = require('wechat-token');
import * as express from 'express';
import { WeChatConfig } from '../../interface/WeChat/WeChatConfig';

export class WeChatRelay extends IChatRelay {
  _bot: any;
  _relay: IChatRelay;

  private app: express.Application;
  private tokenManager = new TokenManager(WECHAT_API_KEY, WECHAT_API_SECRET);
  private config: WeChatConfig = {
    token: null,
    appid: WECHAT_API_KEY,
    encodingAESKey: WECHAT_API_SECRET
  };

  connect(): void {
    console.log("Connecting to WeChat");
    const self = this;

    this.tokenManager.on('token', this.onTokenRecieved.bind(this));
    this.tokenManager.on('error', this.onTokenError.bind(this));

    this.tokenManager.refresh(function(token) {});
    this.tokenManager.start();
  }

  setUpWeChatConnection(): void {
    // Start express server
    this.app = express();
    const base64secret = 'tZ8vkaAhYX4G2SxS9QMcQw';
    let newConfig = this.config;
    newConfig.encodingAESKey = base64secret;

    this.app.use('/wechat', wechat(newConfig, this.onWeChatResponse.bind(this)));
  }

  sendMessage(message: string, chatId: any): boolean {
    return false;
  }

  onWeChatResponse(req: any, res: any, next: any): void {
    console.log(req);
    console.log(res);
    console.log(next);
  }

  onTokenRecieved(token: string): void {
    console.log(token);
    this.config.token = token;

    this.setUpWeChatConnection();
  }

  onTokenError(error: any): void {
    console.log(error);
    console.error(error);
  }
}