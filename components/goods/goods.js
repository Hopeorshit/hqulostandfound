// components/goods/goods.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
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

    
  }
})