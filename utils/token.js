/*
@byron Token机制层
1先从本地读取
2没有的话就重新从服务器获取
3有的话去服务器验证是否有效
4无效的话重新获取
*/
import { Config } from '../utils/config.js'
class Token {
  constructor() {
    this.verifyUrl = Config.restUrl + 'token/verify_token',
    this.tokenUrl = Config.restUrl + 'token/get_token' 
  }
  verify() {
    var token = wx.getStorageSync('token');
    if (!token) {
      this.getTokenFromServer();
    }
    else {
      this.verifyFromServer();
    }
  }
  getTokenFromServer(callBack) {
    var that = this;
    wx.login({
      success: res => {
        console.log(res);
        wx.request({
          url: that.tokenUrl,
          data: {
            code:res.code
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: "POST",
          success: function (res) {
            wx.setStorageSync('token', res.data.token);
            callBack && callBack(res.data.token);
          }
        })
      }
    })
  }
  verifyFromServer(token) {
    var that = this;
    wx.request({
      url: that.verifyUrl,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync('token')
      },
      method: 'GET',
      success: function (res) { 
        if(!res.data){
         that.getTokenFromServer();
        }
      },
    })
  }
}

export {Token};