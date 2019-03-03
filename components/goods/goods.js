// components/goods/goods.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: Object,
    categoryID: Number,
    initSel:{
      type: Boolean,
      observer: "_initObj"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    sel_obj: {
      selected: false,
      selecting: false,
      number: 0
    }
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
      let index = event.currentTarget.dataset.index;
      if (!this.data.sel_obj.selecting) {
        wx.navigateTo({
          url: '/pages/goodsdetail/goodsdetail?goods_id=' + goods_id + '&is_found=' + is_found,
        })
      } else {
        let list = this.data.list;
        let sel_obj = this.data.sel_obj;
        let number = sel_obj.number;
        let selected = sel_obj.selected;

        console.log(number);

        //选择数量不可超过6个
        if (!list[index]['selected']) {
          if (0 <= number && number < 6) {
            if (!list[index]['selected']) {
              number++;
            }
            list[index]['selected'] = !list[index]['selected'];
          }
        } else {
          if (0 < number && number <= 6) {
            if (list[index]['selected']) {
              number--;
            }
            list[index]['selected'] = !list[index]['selected'];
          }
        }
        console.log(number);

        selected = number >= 1 ? true : false;

        sel_obj.selected = selected;
        sel_obj.number = number;
        this.setData({
          list: list,
          sel_obj: sel_obj
        })
      }
    },

    /**
     * 长图预览
     */
    onShare: function() {
      let list = this.data.list;
      let share_list=new Array();
      list.forEach((v)=>{
        if(v['selected']){
          share_list.push(v)
        }
      })
      wx.setStorageSync('share_list', share_list);
      wx.navigateTo({
        url: '/pages/preview/preview',
      })
    },

    /**
     * 长图预览
     */
    onSelectTop: function() {
      let sel_obj = this.data.sel_obj;
      sel_obj.selecting = !sel_obj.selecting;
      let list = this.data.list;
      this.setData({
        sel_obj: sel_obj
      })
      if (!sel_obj.selecting) {
        list.forEach((v) => {
          v['selected'] = false;
        });
        this.setData({
          list: list
        })
        this._initObj();
        console.log(this.data.sel_obj);
      }
    },

    _initObj: function() {
      console.log("触发_initObj")
      this.setData({
        sel_obj: {
          selected: false,
          selecting: false,
          number: 0
        }
      })
    }
  }
})