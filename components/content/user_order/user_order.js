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

  // attached: function () {
  //   this.init();
  // },

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
        this._orderUser(content.page, content.page_size, (res) => {
          this.setMoreData(res.data)
          this.setData({
            loading: false
          })
        })
      }
    },
    _orderUser(page, page_size,callBack) {
      var params = {
        url: 'order/user?page='+page+'&page_size='+page_size,
        sCallBack: function (res) {
          callBack && callBack(res);
        },
      };
      http.request(params);
    },
    
    //TODO 为保持组件的完整性 可导出性 此处最好通过Triggerevent
    onDetailTap: function (event) {
      let order_id = event.currentTarget.dataset.order_id;
      let order_status = event.currentTarget.dataset.order_status;
      let eventDatail={
        order_id:order_id,
        order_status:order_status
      }
      this.triggerEvent('detail',eventDatail)
  
    } 

  }
})