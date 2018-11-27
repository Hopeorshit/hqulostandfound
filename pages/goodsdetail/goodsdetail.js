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
    whiteBackground: "/images/white.jpg",
    code: "/images/code.jpg",
    lostImage: "/images/lost3.png",
    foundImage: "/images/found3.png",
    height: 0,
    creating: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.setData({
      goods_id: options.goods_id
    })
    wx.setNavigationBarTitle({
      title: options.is_found==1?"失物招领":"寻物启事",
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

  hideMask: function() {
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
   * 海报绘制
   */
  save: function() { //保存到本地
    wx.showLoading({
      title: '生成中',
    })
    var that = this
    setTimeout(function() {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        fileType: 'png',
        height: that.data.height + 20,
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
            }
          })
        }
      })
    }, 3000)
  },

  drawCanvas: function() {
    this.setData({ //防止连续多次按
      creating: true
    })
    // wx.showLoading({
    //   title: '生成中',
    // })
    this.downloadMainPic((res) => {
      this.drawBackGround();
      this.drawDeatil();
      this.drawContact();
      if (this.data.tempFilePath) {
        this.drawMainPic((res) => {
          this.drawLine();
          this.drawCode();
          this.save();
        });
      } else {
        this.drawLine();
        this.drawCode();
        this.save();
      }
    })
  },

  drawMainPic: function(callBack) {
    var that = this;
    var canvasWidth = this.data.canvasWidth;
    var tempFilePath = that.data.tempFilePath
    wx.getImageInfo({
      src: tempFilePath,
      success: function(imageRes) {
        console.log(imageRes)
        var size = imageRes.height / imageRes.width;
        var height = that.data.height + 30
        var oriWidth = canvasWidth * 0.8;
        var oriHeight = canvasWidth * size * 0.8;
        if (size > 1) {
          myCanvas.translate(canvasWidth * 0.1, height); //移动画布原点
          myCanvas.rotate(-90 * Math.PI / 180); //旋转画布
          myCanvas.translate(-oriWidth / size, 0) //再次移动画布原点      
          myCanvas.drawImage(tempFilePath, 0, 0, oriWidth / size, oriWidth);
          myCanvas.draw(true);
          // 还原画布
          myCanvas.translate(oriWidth / size, 0)
          myCanvas.rotate(90 * Math.PI / 180)
          myCanvas.translate(-canvasWidth * 0.1, -height); //移动画布原点
          height = height + oriWidth / size;
        }else{
          myCanvas.drawImage(tempFilePath,canvasWidth * 0.1, height, oriWidth, oriHeight);
          height = height + oriHeight;
        }
        that.setData({
          height: height
        })
        callBack && callBack()
      }
    })
  },

  downloadMainPic: function(callBack) {
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

  drawBackGround: function() {
    var canvasWidth = this.data.canvasWidth
    myCanvas.drawImage(this.data.whiteBackground, 0, 0, canvasWidth, 1000); //1画一个白色背景图片
    myCanvas.draw(true); //继续绘制
  },

  drawDeatil: function() {
    var canvasWidth = this.data.canvasWidth;
    var height = this.data.height
    console.log(height);
    //3绘制详情字体
    var imageType = this.data.detail.is_found == 1 ? this.data.foundImage : this.data.lostImage;
    myCanvas.drawImage(imageType, canvasWidth / 2 - 80, height + 20, 160, 49)
    height = height + 20;
    myCanvas.draw(true);
    myCanvas.setFontSize(15);
    myCanvas.setTextAlign('center');
    myCanvas.setFillStyle('#8f8e8f');
    myCanvas.fillText(this.data.time, canvasWidth / 2 + 90, height + 70)
    height = height + 130
    myCanvas.draw(true);
    myCanvas.setFillStyle('#3a3a3a')
    var fontSize = 50;
    myCanvas.setFontSize(fontSize)
    var str = this.data.detail.description;
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    height = height + 4;
    for (let i = 0; i < str.length; i++) {
      lineWidth += myCanvas.measureText(str[i]).width;
      if (lineWidth > canvasWidth - fontSize) {
        myCanvas.fillText(str.substring(lastSubStrIndex, i), canvasWidth / 2, height); //绘制截取部分
        height += fontSize; //40为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
      }
      if (i == str.length - 1) { //绘制剩余部分
        myCanvas.fillText(str.substring(lastSubStrIndex, i + 1), canvasWidth / 2, height);
      }
    }
    myCanvas.draw(true)
    this.setData({
      height: height
    })
  },

  drawContact: function() { //绘制联系方式
    var canvasWidth = this.data.canvasWidth;
    var height = this.data.height
    myCanvas.setFontSize(30);
    myCanvas.setFillStyle('#3a3a3a')
    myCanvas.fillText(this.beforeText() + ' ' + this.data.detail.phone, canvasWidth / 2, height + 50);
    myCanvas.draw(true)
    this.setData({
      height: height + 50
    })
  },

  drawLine: function() { //绘制线条
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

  drawCode: function() {
    var canvaWidth = this.data.canvasWidth;
    var height = this.data.height
    height = height + 15;
    myCanvas.drawImage(this.data.code, 40, height, 70, 70); //
    myCanvas.draw(true)
    var fontSize = 14;
    myCanvas.setFontSize(fontSize);
    myCanvas.setFillStyle('#8f8e8f')
    myCanvas.setTextAlign('left');
    height = height + 20
    myCanvas.fillText("寻找校园合伙人：837269003@qq.com", 120, height);
    height = height + fontSize
    myCanvas.fillText("技术支持:微作校园开发团队", 120, height);
    myCanvas.setFontSize(12);
    height = height + fontSize
    myCanvas.fillText("(长按小程序码了解更多失物招领信息)", 120, height);
    height = height + 12
    myCanvas.draw(true)
    this.setData({
      height: height
    })
  },

  beforeText: function() {
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