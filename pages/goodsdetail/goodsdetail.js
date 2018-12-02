// pages/goodsdetail/goodsdetail.js
import {
  GoodsDetail
} from "../../model/goodsdetail.js"
var http = new GoodsDetail();
const myCanvas = wx.createCanvasContext('myCanvas', this);
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showMask: false,
    code: "/images/code.jpg",
    lostImage: "/images/lost.png",
    foundImage: "/images/found.png",
    height: 0,
    creating: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options);
    this.setData({
      goods_id: options.goods_id
    })
    wx.setNavigationBarTitle({
      title: options.is_found == 1 ? "失物招领" : "寻物启事",
    })
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          canvasWidth: res.windowWidth,
        })
      },
    })
  },

  onShow() {
    this.checkLogin(() => {
      this.httpHttp((res) => {
        this.setData({
          notFirstLoad: true,
          userInfo: wx.getStorageSync('userInfo')
        })
      });
    });
  },
  /**
   * 获取商品详情的HTTP请求和回调
   */
  httpHttp: function(callBack) {
    http.goodsDetail(this.data.goods_id, (res) => {
      var timeArr = (res.data.created).split(' ')
      this.setData({
        detail: res.data,
        time: timeArr[0]
      })
      callBack && callBack();
    })
  },

  /**
   *点击复制 
   */
  copy: function() {
    wx.setClipboardData({
      data: this.data.detail.phone,
      success: function(res) {
        wx.showToast({
          title: '已复制',
          icon: 'none'
        })
      }
    })
  },
  /**
   *点击拨打电话 
   */
  phone: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.detail.phone,
    })
  },
  /**
   * 
   */
  checkLogin: function(callBack) {
    var app = getApp();
    this.setData({
      loginStatus: app.globalData.loginStatus
    })
    if (!app.globalData.loginStatus) {
      wx.showModal({
        title: '温馨提示',
        content: '使用这个功能，需要先登录哦',
        confirmText: "前去登陆",
        cancelText: "先逛逛~",
        confirmColor: "#ff6263",
        cancelColor: "#a9aaac",
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    } else {
      callBack && callBack()
    }
  },

  showMask: function() {
    this.setData({
      showMask: true
    })
  },

  onHideMask: function() {
    this.setData({
      showMask: false
    })
  },

  /*
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  /**
   * 点击绘制
   */

  onDrawCanvas: function() {
    this.setData({ //防止连续多次按
      creating: true
    })
    wx.showLoading({
      title: '生成中',
    })
    this._downloadMainPic((res) => {
      this._drawBackGround();
      // this._drawDetail();
      // this._drawContact();
      if (this.data.tempFilePath) {
        this._drawMainPic((res) => {
          this._drawRestAndSave();
        });
      } else {
        this._drawRestAndSave();
      }
    })
  },

  /**
   * 保存
   */
  _save: function() { //保存到本地
    // wx.showLoading({
    //   title: '生成中',
    // })
    var that = this
    // setTimeout(function() {
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      fileType: 'png',
      height: that.data.height,
      success: function(res) {
        console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          complete: function() {
            wx.hideLoading(),
              wx.showToast({
                title: '已保存到相册',
              })
            that.setData({
              height: 0,
              creating: false
            })
            // that.onHideMask();
          }
        })
      }
    })
    // }, 3000)
  },
  /**
   * 绘制除主图之外的其它图片
   */
  _drawRestAndSave() {
    this._drawTitle();
    this._drawDate();
    this._drawDetail();
    this._drawContact();
    this._drawLine();
    this._drawCode();
    this._drawType(()=>{
      console.log('save-------------')
      this._save();
    });

  },

  /**
   * 绘制主要图片
   * 根据图片的比例决定是否要旋转
   */
  _drawMainPic: function(callBack) {
    var that = this;
    var canvasWidth = this.data.canvasWidth;
    var tempFilePath = that.data.tempFilePath
    wx.getImageInfo({
      src: tempFilePath,
      success: function(imageRes) {
        console.log(imageRes)
        var size = imageRes.height / imageRes.width;
        // var height = that.data.height + 30
        var height = that.data.height + 4;
        var oriWidth = canvasWidth * 0.98;
        var oriHeight = oriWidth * size;
        if (size > 1) {
          myCanvas.translate(canvasWidth * 0.01, height); //移动画布原点
          myCanvas.rotate(-90 * Math.PI / 180); //旋转画布
          myCanvas.translate(-oriWidth / size, 0); //再次移动画布原点      
          myCanvas.drawImage(tempFilePath, 0, 0, oriWidth / size, oriWidth); //绘制
          myCanvas.draw(true);
          // 还原画布
          myCanvas.translate(oriWidth / size, 0) //移动画布原点
          myCanvas.rotate(90 * Math.PI / 180) //旋转还原
          myCanvas.translate(-canvasWidth * 0.01, -height); //移动画布原点
          height = height + oriWidth / size;
        } else {
          myCanvas.drawImage(tempFilePath, canvasWidth * 0.01, height, oriWidth, oriHeight);
          height = height + oriHeight;
        }
        that.setData({
          height: height
        })
        console.log(height)
        callBack && callBack()
      }
    })
  },

  /**
   * 下载主要图片
   */
  _downloadMainPic: function(callBack) {
    var that = this;
    var goodsImages = that.data.detail.images; //2绘制图片
    if (goodsImages.length > 0) {
      var goodsImage = goodsImages[0].url
      wx.downloadFile({
        url: goodsImage,
        success: function(res) {
          that.setData({
            tempFilePath: res.tempFilePath
          })
          callBack && callBack()
        }
      })
    } else {
      callBack && callBack()
    }
  },

  /**
   * 绘制背景图片
   */
  _drawBackGround: function() {
    var canvasWidth = this.data.canvasWidth
    // myCanvas.drawImage(this.data.whiteBackground, 0, 0, canvasWidth, 1000); //1画一个白色背景图片
    myCanvas.setFillStyle('white');
    myCanvas.fillRect(0, 0, canvasWidth, 1000);
    myCanvas.draw(true); //继续绘制
  },

  /**
   * 绘制物品名称
   */
  _drawTitle: function() {
    let fontSize = 20;
    myCanvas.setFontSize(fontSize);
    myCanvas.font = 'bold 20px sans-serif'
    let height = this.data.height + 40;
    myCanvas.setFillStyle('#3a3a3a')
    let str = this.data.detail.title;
    let canvasWidth = this.data.canvasWidth;
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
   * 绘制日期
   */
  _drawDate: function() {
    var height = this.data.height + 20;
    var canvasWidth = this.data.canvasWidth;
    myCanvas.setFontSize(11);
    myCanvas.setFillStyle('#8f8e8f');
    myCanvas.fillText(this.data.time, canvasWidth - 80, height);
    myCanvas.draw(true);
    this.setData({
      height: height
    })
  },

  /**
   * 绘制详情
   */
  _drawDetail: function() {
    if (this.data.detail.description) {
      var canvasWidth = this.data.canvasWidth;
      var height = this.data.height
      console.log(height);
      height = height + 20;
      myCanvas.setFillStyle('#8f8e8f')
      myCanvas.font = 'normal 13px sans-serif'
      var fontSize = 13;
      myCanvas.setFontSize(fontSize)
      var str = this.data.detail.description;
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
  _drawContact: function() { //绘制联系方式
    var canvasWidth = this.data.canvasWidth;
    var height = this.data.height
    height = height + 20;
    myCanvas.fillText(this._beforeText() + ' ' + this.data.detail.phone, 20, height);
    myCanvas.draw(true)
    this.setData({
      height: height
    })
  },

  /**
   * 绘制线条
   */
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
   * 绘制二维码等
   */
  _drawCode: function() {
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
    myCanvas.draw(true)
    this.setData({
      height: height + 30
    })
  },

  _drawType(callBack) {
    var height = this.data.height;
    var canvasWidth = this.data.canvasWidth;
    var typeHeight = 125;
    var typeWidth = 150;
    var imageType = this.data.detail.is_found == 1 ? this.data.foundImage : this.data.lostImage;
    myCanvas.drawImage(imageType, canvasWidth - typeWidth, height - typeHeight, typeWidth, typeHeight);
    myCanvas.draw(true,function(e){
      console.log('-----------------')
      callBack && callBack()
    });
  },

  /**
   * 联系方式前面的字体
   */
  _beforeText: function() {
    var t = ''
    if (this.data.detail.is_found == 1) {
      t = '失主请'
    }
    if (this.data.detail.way == 1) {
      return '领取地点:'
    }
    if (this.data.detail.way == 2) {
      return t + "联系QQ:"
    }
    if (this.data.detail.way == 3) {
      return t + '联系微信:'
    }
    if (this.data.detail.way == 4) {
      return t + '联系手机:'
    }
  }
})