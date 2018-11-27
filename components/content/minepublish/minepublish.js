// components/content/un_token/un_token.js
import {
  contentBeh
} from '../content_beh.js'
import {
  Base
} from '../../../utils/base.js'
let http = new Base;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    load_more: {
      type: String,
      observer: '_loadMore'
    },
    init: {
      type: String,
      observer: 'init'
    },
    categoryID: Number
  },

  /**
   * 组件的初始数据
   */
  behaviors: [contentBeh],
  data: {
    loading: false,
  },

  /**
   * 生命周期
   * TODO 此时不能attached
   */
  lifetimes: {
    ready: function() {
      this.init();
    },
  },


  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      this.initContent(); //初始化content
      this._loadMore(); //加载更多数据
    },

    _loadMore() { //获取更多订单
      if (!this.more()) {
        return false;
      }
      if (!this.data.loading) {
        this.setData({
          loading: true,
        })
        let content = this.data.content;
        this._list(content.page, content.page_size, (res) => {
          this.setMoreData(res.data)
          this.setData({
            loading: false
          })
        })
      }
    },

    _list(page, page_size, callBack) { //获取所有的没被接的订单的HTTP请求
      let params = {
        url: 'user/goods?page=' + page + '&page_size=' + page_size,
        sCallBack: function(res) {
          callBack && callBack(res);
        },
      };
      http.request(params);
    },

    /*
     *点击调转
     */
    onGoodsDetail: function(event) {
      let goods_id = event.currentTarget.dataset.goods_id;
      let is_found = event.currentTarget.dataset.is_found;
      wx.navigateTo({
        url: '/pages/goodsdetail/goodsdetail?goods_id=' + goods_id + '&is_found=' + is_found,
      })
    },

    //点击解决或者删除
    onGoodsHandle: function(e) {
      var that = this;
      var dataset = e.currentTarget.dataset;
      wx.showModal({
        title: '温馨提示',
        content: dataset.handle_type == 2 ? '确认后将不再展示' : "是否确认删除",
        confirmText: "确认",
        cancelText: "取消",
        confirmColor: "#ff6263",
        cancelColor: "#a9aaac",
        success: function(res) {
          if (res.confirm) {
            that._goodsHanleRequest(dataset);
          }
        }
      })
    },

    /**
     * 操作
     */
    _goodsHanleRequest: function(dataset) {
      this._goodsHandleHttp(dataset, (res) => {
        wx.showToast({
          title: '操作成功',
        })
        var index = dataset.index;
        var content = this.data.content;
        content.list.splice(index, 1);
        this.setData({
          content: content
        })
      })
    },


    _goodsHandleHttp(dataset, callBack) {
      var params = {
        url: 'goods/handle',
        sCallBack: function(res) {
          callBack && callBack(res);
        },
        method: "POST",
        data: {
          goods_id: dataset.goods_id,
          handle_type: dataset.handle_type
        }
      };
      http.request(params);
    }



  }
})