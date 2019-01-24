// pages/mine/mine.js
var app = getApp();
import {
  loginTip
} from '../../utils/util.js';
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

  onShow: function() {
    this.setData({
      loginStatus: app.globalData.loginStatus
    })
    if (!app.globalData.loginStatus) {
      loginTip();
    } else {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    }
  },

  minePublish: function() {
    wx.navigateTo({
      url: '/pages/minepublish/minepublish',
    })
  },

  mineNeed: function() {
    wx.navigateTo({
      url: '/pages/mineneed/mineneed',
    })
  },

  mineWant: function() {
    wx.navigateTo({
      url: '/pages/minewant/minewant',
    })
  },

  rule: function() {
    wx.navigateTo({
      url: '/pages/rule/rule',
    })
  },

  edit: function() {
    wx.navigateTo({
      url: '/pages/infoedit/infoedit',
    })
  }

})