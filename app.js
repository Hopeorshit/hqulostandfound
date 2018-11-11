//app.js
import { Token } from 'utils/token.js';
App({
  onLaunch: function () { 
    // // 登录
    // wx.login({
    //   success: res => {
    //   // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    //获取用户信息
    var token = new Token();
    token.verify();
  },
  globalData: {
    indexRefresh:false,
    mineSRefresh:false,
    loginStatus:wx.getStorageSync('userInfo')?true:false
  }
})