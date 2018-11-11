var app = getApp();
import {
  Index
} from "../../utils/http.js"
var index = new Index;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    banner: [{
      url: '/images/banner2.png'
    }],
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
    ]
  },
  /*
   *转发再次进入会重载页面，但是app.globalData确没变
   */
  onLoad: function() {
    this.initData();
    this.categoryAll((res) => {
      this.setData({
        notFirstLoad: true
      })
    });
  },

  onShow: function(options) {
    console.log(app.globalData.indexRefresh);
    if (app.globalData.indexRefresh) {
      this.initData();
      this.categoryAll((res) => {
        this.setData({
          notFirstLoad: true
        })
      });
      app.globalData.indexRefresh = false;
    }
  },
  /*
   *初始化data页面数据
   */
  initData() {
    this.setData({
      content: {
        list: [],
        page: 1,
        hasMore: true,
      }
    })
  },

  /*
   *获取目录HTTP请求
   */
  categoryAll: function(callBack) {
    // index.categoryAll((res) => {
    //   
    //   this.setData({
    //     tabs:res.data
    //   })
    this.categoryID();
    callBack && callBack();
    // })
  },

  //请求目录下的商品，并进行数据绑定
  categoryID(callBack) {
    index.categoryID(0, this.data.content.page, (res) => {
      console.log(res);
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

  /*
   *点击goodsDetail
   */
  goodsDetail: function(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/goodsdetail/goodsdetail?goods_id=' + e.currentTarget.dataset.goods_id,
    })
  },
  /*
  点击tab选项卡
  */
  tabClick: function(e) {
    var activeIndex = e.currentTarget.id;
    console.log(e);
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: activeIndex
    });
    var tabs = this.data.tabs;
    if (!tabs[activeIndex].tap) {
      this.categoryID();
    }
  },

  contentScrollUp: function() {
    this.setData({
      canScroll: false
    })
  },

  onReachBottom: function() {
    if (this.data.content.hasMore) {
      this.categoryID();
    }
  },

  onPullDownRefresh: function() {
    this.initData();
    this.categoryID((res) => {
      wx.stopPullDownRefresh();
    });
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

  bannerTap: function(e) {
    var dataSet = e.currentTarget.dataset;
    var index = dataSet.index;
    if (index == 0) {
      wx.navigateTo({
        url: '/pages/rule/rule',
      })
    }
    if (index == 1) {
      wx.navigateTo({
        url: '/pages/publishershou/publishershou',
      })
    }
    if (index == 2) {
      wx.navigateTo({
        url: '/pages/publishneed/publishneed',
      })
    }
  },

  position: function(e) {
    var dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/position/position?categoryID=' + dataset.category_id + '&name=' + dataset.name
    })
  },

  onShareAppMessage: function() {

  },


})