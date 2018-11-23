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
    }
  },

  /**
   * 组件的初始数据
   */
  behaviors: [contentBeh],
  data: {
    loading: false,
  },

  attached: function() {
    this.init();
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
        this._orderUnToken(content.page, content.page_size, (res) => {
          this.setMoreData(res.data)
          this.setData({
            loading: false
          })
        })
      }
    },

    _orderUnToken(page, page_size, callBack) { //获取所有的没被接的订单的HTTP请求
      let params = {
        url: 'order/un_token?page=' + page + '&page_size=' + page_size,
        sCallBack: function(res) {
          callBack && callBack(res);
        },
      };
      http.request(params);
    },

    /**
     * 接单按钮
     */
    onTakeOrder: function(event) {
      let order_id = event.currentTarget.dataset.order_id;
      let that = this;
      wx.showModal({
        title: '是否确认接单',
        content: '接单后您将看到对方的联系方式,对方评价之后才能录入工时系统哦',
        confirmColor:'#73b3d5',
        success: function(res) {
          if (res.confirm) {
            that._confirmToTake(order_id);
          }
        }
      })
    },

    _confirmToTake: function (order_id) {
      this._orderTake(order_id, (res) => {
        if (res.code !== 201) {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '接单成功',
          })
        }
        let that = this;
        setTimeout(function() {
          that.init();
        }, 1500)
      })
    },

    _orderTake(order_id, callBack) {
      var params = {
        url: 'order/take',
        sCallBack: function(res) {
          callBack && callBack(res);
        },
        method: 'POST',
        data: {
          order_id: order_id,
        }
      };
      http.request(params);
    }

  }
})