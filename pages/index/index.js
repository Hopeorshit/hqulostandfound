var app = getApp();
import {
  Index
} from "../../model/index.js";
import {
  randomStr
} from '../../utils/util.js';
var index = new Index;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    categoryID: 0, //项目目录
    banner: [{
        url: '/images/banner2.png',
      },
      // {
      //   url: '/images/banner2.png',
      // }
    ],
    tabs: [{
        id: 1,
        name: "今天",
        image: "/images/today.png"
      }, {
        id: 2,
        name: "昨天",
        image: "/images/yesterday.png"
      },
      {
        id: 3,
        name: "一周内",
        image: "/images/week.png"
      }, {
        id: 4,
        name: "更久",
        image: "/images/long.png"
      }
    ],
    // hideTips: false
  },
  /*
   *转发再次进入会重载页面，但是app.globalData确没变
   */
  onLoad: function() {

  },

  onShow: function(options) {
    console.log(app.globalData.indexRefresh);
    if (app.globalData.indexRefresh) {
      this.setData({
        init: randomStr(16)
      })
      app.globalData.indexRefresh = false;
    }
  },

  /**
   * 上拉加载更多
   */
  onReachBottom: function() {
    console.log('上拉刷新');
    this.setData({
      load_more: randomStr(16)
    })
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() { //TODO 下拉刷新去触发父类可以通过 observer 来触发
    console.log('下拉刷新')
    this.setData({
      init: randomStr(16)
    })
  },

  /*
   *以下部分是处理搜索框逻辑
   */
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  search: function() {
    wx.navigateTo({
      url: '/pages/search/search?text=' + this.data.inputVal
    })
  },
  /**
   * 点击banner跳转
   * TODO
   */
  onBannerTap: function(e) {
    var dataSet = e.currentTarget.dataset;
    var index = dataSet.index;
    if (index == 0) {
      wx.navigateTo({
        url: '/pages/rule/rule',
      })
    }
  },

  /**
   * 点击日期目录
   */
  onDate: function(e) {
    var dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/date/date?categoryID=' + dataset.category_id + '&name=' + dataset.name
    })
  },

  /**
   * 分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 点击跳转tip
   */
  onTipTap:function(){
    wx.navigateTo({
      url: '/pages/pub_card/pub_card?is_found=0',
    })
  },

  /**
   * 点击跳转hidden
   */
  onHide:function(){
    this.setData({
      hideTips:true
    })
  }

})