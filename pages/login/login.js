// pages/login/login.js
var app=getApp();
import {
  Login
} from './login_model.js';
var login = new Login();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  login: function(e) {
    var that = this;
    that.wxGetUserInfo(e, (res) => {
       wx.showToast({
         title: '登陆成功',
       })
       setTimeout(function(){
         wx.navigateBack();
       },1500)
    })
  },
  wxGetUserInfo: function(event, callBack) {
    if (!event.detail.userInfo) {
      wx.showModal({
        title: '提示',
        content: '取消授权，部分功能无法正常使用，是否重新授权',
        cancelText: "否",
        confirmText: "是",
        success: function(res) {
          if (res.confirm) {
            wx.openSetting({})
          }
        }
      })
    } else {
      login.encrypt(event.detail.encryptedData, event.detail.iv,
        (res) => {
          app.globalData.loginStatus = true;
          wx.setStorageSync('userInfo', res.data);
          callBack && callBack(res);
        },
      )
    }
  }
})