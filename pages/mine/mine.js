// pages/mine/mine.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  onShow: function () {
    this.setData({
      loginStatus: app.globalData.loginStatus
    })
    if (!app.globalData.loginStatus) {
      wx.showModal({
        title: '温馨提示',
        content: '使用这个功能，需要先登录哦',
        confirmText: "前去登陆",
        cancelText: "先逛逛~",
        confirmColor: "#ff6263",
        cancelColor: "#a9aaac",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    }else{
      this.setData({
        userInfo:wx.getStorageSync('userInfo')
      })
    }
  },
  
  minePublish:function(){
    wx.navigateTo({
      url: '/pages/minepublish/minepublish',
    })
  },

  mineNeed: function () {
    wx.navigateTo({
      url: '/pages/mineneed/mineneed',
    })
  },

  mineWant:function(){
    wx.navigateTo({
      url: '/pages/minewant/minewant',
    })
  },

  rule:function(){
    wx.navigateTo({
      url: '/pages/rule/rule',
    })
  },

  edit:function(){
    wx.navigateTo({
      url: '/pages/infoedit/infoedit',
    })
  }

})