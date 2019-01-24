// pages/pub_choose/pub_choose.js
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

  onShow: function () {
    this.setData({
      loginStatus: app.globalData.loginStatus
    })
    if (!app.globalData.loginStatus) {
      loginTip();
    } else {

    }
  },
 
  /**
   * 点击普通发布
   */
  onNormal:function(){
    wx.navigateTo({
      url: '/pages/publish/publish',
    })
  },
  
  /**
   * 点击捡到学生卡
   */
  onCard:function(){
    wx.navigateTo({
      url: '/pages/pub_card/pub_card?is_found=1',
    })
  }

})