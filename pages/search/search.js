import {
  randomStr
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
    console.log(options.text)
    this.setData({
      inputVal: options.text,
      inputShowed: false
    })

  },

  /**
   * 上拉加载更多
   */
  onReachBottom: function () {
    console.log('上拉刷新');
    this.setData({
      load_more: randomStr(16)
    })
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () { //TODO 下拉刷新去触发父类可以通过 observer 来触发
    console.log('下拉刷新')
    this.setData({
      init: randomStr(16)
    })
  },
  /**
   * 商品详情页面跳转
   */
  onGoodsDetail: function (event) {
    let goods_id = event.detail.goods_id;
    wx.navigateTo({
      url: '/pages/goodsdetail/goodsdetail?goods_id=' + goods_id,
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

  onSearch: function() {
    this.setData({
      init: randomStr(16)
    })
  },
 
})