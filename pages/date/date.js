var app = getApp();
import {
  Date
} from "../../model/date.js"
var http = new Date();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: {
      list: [],
      page: 1,
      hasMore: true,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.categoryID)
    this.setData({
      categoryID: options.categoryID
    })
    wx.setNavigationBarTitle({
      title: options.name,
    })
    this.initData();
    this.categoryID((res) => {
      this.setData({
        notFirstLoad: true
      })
    });
  },

  initData: function () {
    this.setData({
      content: {
        list: [],
        page: 1,
        hasMore: true,
      }
    })
  },

  categoryID(callBack) {
    http.categoryID(this.data.categoryID, this.data.content.page, (res) => {
      var content = this.data.content;
      var resList = res.data;
      var contentList = content.list;
      content.list = contentList.concat(resList);
      content.page = content.page + 1;
      if (resList.length == 10) {
        content.hasMore = true;
      } else {
        content.hasMore = false;
      }
      this.setData({
        content: content
      })
      callBack && callBack();
    })
  },


  onReachBottom: function () {
    if (this.data.content.hasMore) {
      this.categoryID();
    }
  },

  onPullDownRefresh: function () {
    this.initData();
    this.categoryID((res) => {
      wx.stopPullDownRefresh();
    });
  },

  goodsDetail: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/goodsdetail/goodsdetail?goods_id=' + e.currentTarget.dataset.goods_id,
    })
  },



})