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
    initSel: false,
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
      // console.log("组件列表初始化")
      // this.setData({
      //   initSel:!this.data.initSel
      // })
      this.initContent(); //初始化content
      this._loadMore(); //加载更多数据
    },

    _loadMore() { //获取更多订单
      console.log("组件列表初始化")
      this.setData({
        initSel:!this.data.initSel
      })
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
          console.log(this.data.content)
        })
      }
    },

    _list(page, page_size, callBack) { //获取所有的没被接的订单的HTTP请求
      console.log(this.data.categoryID);
      let id = this.data.categoryID;
      let params = {
        url: 'category/id?categoryID=' + id + '&page=' + page + '&page_size=' + page_size,
        sCallBack: function(res) {
          callBack && callBack(res);
        },
      };
      http.request(params);
    },

 

  }
})