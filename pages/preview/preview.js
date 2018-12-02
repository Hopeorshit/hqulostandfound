// pages/preview/preview.js
import {
  Preview
} from "../../model/preview.js"
let http = new Preview();
const myCanvas = wx.createCanvasContext('myCanvas', this);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "/images/code.jpg", //小程序码
    height: 0, //高度
    tempFile: null, //显示的图片
    list: [], //请求回来的list
  },

  /**
   * 生命周期函数--监听页面加载
   * 1先发送HTTP请求
   * 2获取屏幕尺寸
   * 3绘制数据
   * 4缓存本地
   * 5数据绑定页面显示
   */
  onLoad: function(options) {
    this._yesterDayHttp();
  },

  _yesterDayHttp: function() {
    wx.showLoading({
      title: '生成中',
    })
    http.yesterday((res) => {
      let list = res.data.list;
      let timeArr = list[0].created.split(' ');
      this.setData({
        list: list,
        time: timeArr[0]
      })
      this._setCanvasWidth(() => {
        this._drawBackGround();
        this._drawDate();
        this._drawData();
        this._drawLine();
        this._drawCode(() => {
          this._setTemp();
        });
      })
    })
  },

  _setCanvasWidth: function(callBack) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          canvasWidth: res.windowWidth,
        })
        callBack && callBack();
      },
    })
  },

  _drawBackGround: function() {
    var canvasWidth = this.data.canvasWidth
    // myCanvas.drawImage(this.data.whiteBackground, 0, 0, canvasWidth, 1000); //1画一个白色背景图片
    myCanvas.setFillStyle('white');
    myCanvas.fillRect(0, 0, canvasWidth, 1000);
    myCanvas.draw(true); //继续绘制
  },

  /**
   * 绘制日期
   */
  _drawDate: function() {
    var height = this.data.height + 40;
    var canvasWidth = this.data.canvasWidth;
    let fontSize = 20;
    myCanvas.setFontSize(fontSize);
    myCanvas.setFillStyle('#ff6263');
    myCanvas.fillText(this.data.time, 20, height);
    myCanvas.draw(true);
    this.setData({
      height: height
    })
  },
  /**
   * 绘制整个数据
   */
  _drawData: function() {
    let list = this.data.list;
    for (let i = 0; i < list.length; i++) {
      let typeStr = list[i].is_found == 1 ? "失物招领：" : "寻物启事：";
      let str = typeStr + list[i].title;
      this._drawStr(str);
      this._drawDetail(list[i].description);
      this._drawContact(list[i])
    }
  },
  /**
   * 绘制单条数据
   */
  _drawStr: function(str) {
    let fontSize = 20;
    myCanvas.setFillStyle('#3a3a3a');
    myCanvas.setFontSize(fontSize);
    let canvasWidth = this.data.canvasWidth;
    let height = this.data.height + 40;
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += myCanvas.measureText(str[i]).width;
      if (lineWidth > canvasWidth - fontSize * 2) { //
        myCanvas.fillText(str.substring(lastSubStrIndex, i), 20, height); //绘制截取部分
        height += fontSize; //
        lineWidth = 0;
        lastSubStrIndex = i;
      }
      if (i == str.length - 1) { //绘制剩余部分
        myCanvas.fillText(str.substring(lastSubStrIndex, i + 1), 20, height);
      }
    }
    myCanvas.draw(true);
    this.setData({
      height: height
    })
  },

  /**
   * 保存到tempFilePath
   */
  _setTemp: function() { //保存到本地
    var that = this
    // setTimeout(function() {
    wx.hideLoading();
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      fileType: 'png',
      height: that.data.height,
      success: function(res) {
        console.log(res.tempFilePath)
        that.setData({
          tempFile: res.tempFilePath
        })

      }
    })
    // }, 3000)
  },
  /**
   * 
   */
  onSave: function() {
    let that = this;
    wx.showLoading({
      title: '保存中',
    })
    wx.saveImageToPhotosAlbum({
      filePath: that.data.tempFile,
      complete: function() {
        wx.hideLoading(),
          wx.showToast({
            title: '已保存到相册',
          })
        that.setData({
          height: 0,
          // creating: false
        })
        // that.onHideMask();
      }
    })
  },

  _drawCode: function(callBack) {
    var canvaWidth = this.data.canvasWidth;
    var height = this.data.height
    height = height + 8;
    var codeSize = 70;
    myCanvas.drawImage(this.data.code, 20, height, codeSize, codeSize); //
    myCanvas.draw(true)
    var fontSize = 12;
    myCanvas.setFontSize(fontSize);
    myCanvas.setFillStyle('#8f8e8f')
    myCanvas.setTextAlign('left');
    height = height + codeSize / 2 - fontSize / 2
    myCanvas.fillText("长按识别华侨大学专属小程序", codeSize + 20 + 8, height);
    height = height + fontSize + 4;
    myCanvas.fillText("发布或搜索更多信息", codeSize + 20 + 8, height);
    height = height + fontSize + 4
    this.setData({
      height: height + 30
    })
    myCanvas.draw(true, () => {
      callBack && callBack();
    })
  },

  _drawLine: function() { //绘制线条
    var canvaWidth = this.data.canvasWidth;
    var height = this.data.height
    myCanvas.setLineWidth(1)
    myCanvas.setStrokeStyle('#838383')
    myCanvas.moveTo(20, height + 20)
    myCanvas.lineTo(canvaWidth - 20, height + 20)
    myCanvas.stroke()
    myCanvas.draw(true)
    this.setData({
      height: height + 20
    })
  },

  /**
   * 绘制详情
   */
  _drawDetail: function(str) {
    if (str) {
      var canvasWidth = this.data.canvasWidth;
      var height = this.data.height
      console.log(height);
      height = height + 20;
      myCanvas.setFillStyle('#8f8e8f')
      myCanvas.font = 'normal 13px sans-serif'
      var fontSize = 13;
      myCanvas.setFontSize(fontSize)
      var lineWidth = 0;
      var lastSubStrIndex = 0; //每次开始截取的字符串的索引
      height = height + 4;
      for (let i = 0; i < str.length; i++) {
        lineWidth += myCanvas.measureText(str[i]).width;
        if (lineWidth > canvasWidth - fontSize * 3) { //
          myCanvas.fillText(str.substring(lastSubStrIndex, i), 20, height); //绘制截取部分
          height += fontSize; //
          lineWidth = 0;
          lastSubStrIndex = i;
        }
        if (i == str.length - 1) { //绘制剩余部分
          myCanvas.fillText(str.substring(lastSubStrIndex, i + 1), 20, height);
        }
      }
      myCanvas.draw(true)
      this.setData({
        height: height
      })
    }
  },

  /**
   * 绘制联系方式
   */
  _drawContact: function(item) { //绘制联系方式
    var canvasWidth = this.data.canvasWidth;
    var height = this.data.height
    height = height + 20;
    myCanvas.setFillStyle('#a9aaac');
    myCanvas.setFontSize(12)
    myCanvas.fillText(this._beforeText(item) + ' ' + item.phone, 20, height);
    myCanvas.draw(true)
    this.setData({
      height: height
    })
  },

  /**
   * 联系方式前面的字体
   */
  _beforeText: function(item) {
    var t = ''
    if (item.is_found == 1) {
      t = '失主请'
    }
    if (item.way == 1) {
      return '领取地点:'
    }
    if (item.way == 2) {
      return t + "联系QQ:"
    }
    if (item.way == 3) {
      return t + '联系微信:'
    }
    if (item.way == 4) {
      return t + '联系手机:'
    }
  }
})