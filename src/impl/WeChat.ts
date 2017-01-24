import { ChatRelay } from '../interface/ChatRelay';
import { WECHAT_API_KEY, WECHAT_API_SECRET } from '../const/private/ApiConsts';
const TokenManager = require('wechat-token');

export class WeChatRelay extends ChatRelay {
  private tokenManager = new TokenManager(WECHAT_API_KEY, WECHAT_API_SECRET);
  private accessToken = '';

  connect(): void {
    console.log("Connecting to WeChat");
    const self = this;

    this.tokenManager.on('token', function(token) {
      console.log(token);
      self.accessToken = token;
    });

    this.tokenManager.on('error', function(error) {
      console.log(error);
      console.error(error);
    });

    this.tokenManager.refresh(function(token) {});
    this.tokenManager.start();
  }
}