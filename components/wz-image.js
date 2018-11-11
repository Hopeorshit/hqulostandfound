// components/wz-image.js
Component({

  properties: {
    img: String,
    height:Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    width:null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onImageLoad: function(e) {
      let width=e.detail.width;
      let height=e.detail.height;
      let size=width/height;
      let pxWidth = this.data.height*size;
      this.setData({
        width:pxWidth
      })
    }
  }
})