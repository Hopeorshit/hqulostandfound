// pages/free/free.js
var app = getApp();
import {
  Search
} from "../../model/search.js"
var http = new Search;
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
  onLoad: function(options) {
    console.log(options.text)
    this.setData({
      inputVal: options.text,
      inputShowed: true
    })
    this.initData();
    this.goodsSearch((res)=>{
      this.setData({
        notFirstLoad: true
      })
    });
  },

  initData: function() {
    this.setData({
      content: {
        list: [],
        page: 1,
        hasMore: true,
      }
    })
  },

  goodsSearch(callBack) {
    http.goodsSearch(this.data.inputVal,this.data.content.page,(res) => {
      var content = this.data.content;
      var resList = res.data;
      var contentList = content.list;
      content.list = contentList.concat(resList);
      content.page = content.page + 1;
      if (resList.length==10) {
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
      this.goodsSearch();
    }
  },

  onPullDownRefresh: function () {
    this.initData();
    this.goodsSearch((res) => {
      wx.stopPullDownRefresh();
    });
  },

  goodsDetail: function(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/goodsdetail/goodsdetail?goods_id=' + e.currentTarget.dataset.goods_id,
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
    this.initData();
    this.goodsSearch();
  },
 
})