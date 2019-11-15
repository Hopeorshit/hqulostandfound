// pages/goodsdetail/goodsdetail.js
import {
  GoodsDetail
} from "../../model/goodsdetail.js";
import {
  loginTip
} from '../../utils/util.js';
let http = new GoodsDetail();
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
    userImage: null, //用户头像
    headBG: "/images/head-bg.png",
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
    let that = this;
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
      let timeArr = (res.data.created).split(' ')
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
    let app = getApp();
    this.setData({
      loginStatus: app.globalData.loginStatus
    })
    if (!app.globalData.loginStatus) {
      loginTip();
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
    this._downloadUserPic(() => {
      console.log('用户头像下载完成')
      this._downloadMainPic((res) => {
        console.log("主图下载完成")
        this._drawBackGround();
        // this._drawHeadBG();
        // this._drawHead();
        // this._drawDate();
        if (this.data.tempFilePath) {
          this._drawMainPic((res) => {
            this._drawRestAndSave();
          });
        } else {
          this._drawRestAndSave();
        }
      })
    })
  },

  /**
   * 绘制除主图之外的其它图片
   */
  _drawRestAndSave() {
    this._drawTitle();
    this._drawDetail();
    this._drawContact();
    this._drawDate();
    this._drawLine();
    this._drawCode();
    // this._drawDashLine();
    this._drawType(() => {
      console.log('save-------------')
      this._save();
    });

  },

  /**
   * 保存
   */
  _save: function() { //保存到本地
    // wx.showLoading({
    //   title: '生成中',
    // })
    let that = this
    // setTimeout(function() {
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      fileType: 'png',
      width: that.data.canvasWidth,
      height: that.data.height,
      success: function(res) {
        console.log(res.tempFilePath)
        console.log(that.data.canvasWidth);
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
   * 绘制背景图
   */
  _drawHeadBG: function() {
    let headBG = this.data.headBG;
    let height = this.data.height;
    let canvasWidth = this.data.canvasWidth;
    myCanvas.drawImage(headBG, 0, 0, canvasWidth, 80);
    myCanvas.draw(true);
    this.setData({
      height: height + 80
    })
  },

  /**
   * 绘制头像
   */
  _drawHead: function() {
    let head = this.data.userImage;
    let canvasWidth = this.data.canvasWidth;
    let height = this.data.height;
    let headRadius = 30; //先剪裁然后再绘制
    myCanvas.save();
    myCanvas.beginPath(); //开始绘
    myCanvas.arc(canvasWidth / 2, height, headRadius, 0, Math.PI * 2);
    myCanvas.clip();
    myCanvas.drawImage(head, canvasWidth / 2 - headRadius, height - headRadius, headRadius * 2, headRadius * 2);
    myCanvas.draw(true);
    myCanvas.restore(); //save 和restore 配合着用
    myCanvas.draw(true);
    this.setData({
      height: height + headRadius
    })
  },

  /**
   * 绘制主要图片
   * 根据图片的比例决定是否要旋转
   */
  _drawMainPic: function(callBack) {
    let that = this;
    let canvasWidth = this.data.canvasWidth;
    let tempFilePath = that.data.tempFilePath
    wx.getImageInfo({
      src: tempFilePath,
      success: function(imageRes) {
        console.log(imageRes)
        let size = imageRes.height / imageRes.width;
        // let height = that.data.height + 30
        let height = that.data.height + 15;
        let toLeft = 20;
        let oriWidth = canvasWidth - toLeft * 2;
        let oriHeight = oriWidth * size;
        if (size > 1) {
          myCanvas.translate(toLeft, height); //移动画布原点
          myCanvas.rotate(-90 * Math.PI / 180); //旋转画布
          myCanvas.translate(-oriWidth / size, 0); //再次移动画布原点      
          myCanvas.drawImage(tempFilePath, 0, 0, oriWidth / size, oriWidth); //绘制
          myCanvas.draw(true);
          // 还原画布
          myCanvas.translate(oriWidth / size, 0) //移动画布原点
          myCanvas.rotate(90 * Math.PI / 180) //旋转还原
          myCanvas.translate(-toLeft, -height); //移动画布原点
          height = height + oriWidth / size;
        } else {
          myCanvas.drawImage(tempFilePath, toLeft, height, oriWidth, oriHeight);
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
    let that = this;
    let goodsImages = that.data.detail.images; //2绘制图片
    if (goodsImages.length > 0) {
      let goodsImage = goodsImages[0].url
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
   * 下载发布人的头像
   */
  _downloadUserPic: function(callBack) {
    let that = this;
    let userImage = that.data.detail.user.avatarUrl; //2绘制图片
    if (userImage) {
      wx.downloadFile({
        url: userImage,
        success: function(res) {
          that.setData({
            userImage: res.tempFilePath
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
    let canvasWidth = this.data.canvasWidth
    // myCanvas.drawImage(this.data.whiteBackground, 0, 0, canvasWidth, 1000); //1画一个白色背景图片
    myCanvas.setFillStyle('white');
    myCanvas.fillRect(0, 0, canvasWidth, 1000);
    myCanvas.draw(true); //继续绘制
  },

  /**
   * 绘制物品名称
   */
  _drawTitle: function() {
    let fontSize = 28;
    myCanvas.font = 'normal bold 28px sans-serif'
    myCanvas.setFontSize(fontSize);
    let height = this.data.height + 40;
    myCanvas.setFillStyle('#3a3a3a')
    let str = this.data.detail.title;
    let canvasWidth = this.data.canvasWidth;
    let lineWidth = 0;
    let lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += myCanvas.measureText(str[i]).width;
      if (lineWidth > canvasWidth - fontSize) { //
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
   * 绘制联系方式
   */
  _drawContact: function() { //绘制联系方式
    let fontSize = 20;
    myCanvas.setFontSize(fontSize);
    myCanvas.setFillStyle('#3a3a3a');
    let canvasWidth = this.data.canvasWidth;
    let height = this.data.height
    height = height + 35;

    let str = this._beforeText() + ' ' + this.data.detail.phone;
    let lineWidth = 0;
    let lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += myCanvas.measureText(str[i]).width;
      if (lineWidth > canvasWidth - fontSize) { //
        myCanvas.fillText(str.substring(lastSubStrIndex, i), 20, height); //绘制截取部分
        height += fontSize + 4; //
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
  },
  /**
   * 绘制日期
   */
  _drawDate: function() {
    let height = this.data.height + 20;
    let canvasWidth = this.data.canvasWidth;
    myCanvas.setFontSize(11);
    myCanvas.setFillStyle('#8f8e8f');
    // myCanvas.setTextAlign('center');
    let str = this.data.detail.user.nickName + this.data.time + '发布'
    myCanvas.fillText(str, 20, height);
    myCanvas.draw(true);
    this.setData({
      height: height
    })
    myCanvas.setTextAlign('left')
  },

  /**
   * 绘制详情
   */
  _drawDetail: function() {
    if (this.data.detail.description) {
      let canvasWidth = this.data.canvasWidth;
      let height = this.data.height
      console.log(height);
      height = height + 30;
      myCanvas.setFillStyle('#3a3a3a')
      myCanvas.font = 'normal bold 20px sans-serif'
      let fontSize = 20;
      myCanvas.setFontSize(fontSize)
      let str = this.data.detail.description;
      let lineWidth = 0;
      let lastSubStrIndex = 0; //每次开始截取的字符串的索引
      height = height + 4;
      for (let i = 0; i < str.length; i++) {
        lineWidth += myCanvas.measureText(str[i]).width;
        if (lineWidth > canvasWidth - fontSize * 3) { //
          myCanvas.fillText(str.substring(lastSubStrIndex, i), 20, height); //绘制截取部分
          height += fontSize + 4; //
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
   * 绘制线条
   */
  _drawLine: function() { //绘制线条
    let canvasWidth = this.data.canvasWidth;
    let height = this.data.height
    myCanvas.setLineWidth(1)
    myCanvas.setStrokeStyle('#838383')
    myCanvas.moveTo(20, height + 20)
    myCanvas.lineTo(canvasWidth - 20, height + 20)
    myCanvas.stroke()
    myCanvas.draw(true)
    this.setData({
      height: height 
    })
  },

  /**
   * 绘制二维码等
   */
  _drawCode: function() {
    let canvasWidth = this.data.canvasWidth;
    let height = this.data.height
    height = height + 26;
    let codeSize = 70;
    myCanvas.drawImage(this.data.code, 20, height, codeSize, codeSize); //
    myCanvas.draw(true)
    let fontSize = 12;
    myCanvas.setFontSize(fontSize);
    myCanvas.setFillStyle('#8f8e8f')
    myCanvas.setTextAlign('left');
    // height = height + codeSize / 2 - fontSize / 2
    height = height + 18;
    myCanvas.fillText("本图片由“华园失物招领”微信小程序生成", codeSize + 20 + 8, height);
    height = height + fontSize + 4;
    myCanvas.fillText("华大厦门失物招领台：638406214", codeSize + 20 + 8, height);
    height = height + fontSize + 4
    myCanvas.fillText("微信: 华侨大学学生资助管理中心", codeSize + 20 + 8, height);
    height = height + fontSize + 4
    myCanvas.fillText("快乐e家阳光服务队", codeSize + 20 + 8, height);
    height = height + fontSize + 4
    myCanvas.draw(true)
    this.setData({
      height: height 
    })
  },

  _drawDashLine() {
    console.log("绘制dashLine----------------------")
    let height = this.data.height-30
    myCanvas.setLineWidth(1)
    myCanvas.setLineDash([5, 2])
    myCanvas.moveTo(20, height)
    myCanvas.lineTo(this.data.canvasWidth - 20, height)
    myCanvas.strokeStyle = "#cbcbcb";
    myCanvas.stroke()
    myCanvas.draw(true)

    myCanvas.setTextAlign('center')
    myCanvas.setFontSize(11)
    myCanvas.fillText('本图片由“华园失物招领”微信小程序生成', this.data.canvasWidth / 2, height + 20)
    myCanvas.draw(true)

    console.log(height)
    this.setData({
      height: height + 30
    })

  },


  _drawType(callBack) {
    let height = this.data.height;
    let canvasWidth = this.data.canvasWidth;
    let typeHeight = 125;
    let typeWidth = 150;
    let imageType = this.data.detail.is_found == 1 ? this.data.foundImage : this.data.lostImage;
    myCanvas.drawImage(imageType, canvasWidth - typeWidth, height - typeHeight, typeWidth, typeHeight);
    myCanvas.draw(true, function(e) {
      console.log('-----------------')
      callBack && callBack()
    });
  },

  /**
   * 联系方式前面的字体
   */
  _beforeText: function() {
    let t = ''
    if (this.data.detail.is_found == 1) {
      t = '失主请'
    }
    if (this.data.detail.way == 1) {
      return '领取地点：'
    }
    if (this.data.detail.way == 2) {
      return t + "联系QQ："
    }
    if (this.data.detail.way == 3) {
      return t + '联系微信：'
    }
    if (this.data.detail.way == 4) {
      return t + '联系手机：'
    }
  }
})