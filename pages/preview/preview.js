// pages/preview/preview.js
import {
  Preview
} from "../../model/preview.js"
import {
  nowDate
} from '../../utils/util.js';
let http = new Preview();
const myCanvas = wx.createCanvasContext('myCanvas', this);
myCanvas.font = 'normal bold 28px sans-serif'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "/images/code.jpg", //小程序码
    height: 0, //高度
    list: [], //请求回来的list
    image_index: 0,
    tempFile: null, //绘制的临时图片
    image_list: [],
    draw_index: 0, //绘制list过程中
    lostImage: "/images/lost.png",
    foundImage: "/images/found.png",
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
    this._drawPreview();
  },

  _drawPreview: function() {
    wx.showLoading({
      title: '生成中',
    })
    let list = wx.getStorageSync('share_list');
    let timeArr = list[0].created.split(' ');
    this.setData({
      list: list,
    })
    this._setCanvasWidth(() => {
      this._drawBackGround(); //绘制背景图片
      this._downloadMainPic(() => { //下载好所有的图片
        this._drawList(() => {
          console.log("绘制Code")
          this._drawCode(() => {
            this._drawDashLine()
            console.log("Code绘制结束")
            this._setTemp();
          });
        }); //绘制所有内容
      })
    })
  },

  /**
   * 设置好屏幕的宽度
   */
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

  /**
   * 绘制list
   */
  _drawList: function(callBack) {
    let draw_index = this.data.draw_index;
    let list = this.data.list;
    console.log("绘制中:" + draw_index + '<' + list.length)
    if (draw_index < list.length) {
      console.log("进入绘制");
      let imageList = this.data.image_list;
      if (imageList[draw_index]) {
        this._drawMainPic(imageList[draw_index], () => {
          console.log(list[draw_index]);
          this._drawExceptPic(list[draw_index]);
          draw_index++;
          this.setData({
            draw_index: draw_index
          })
          this._drawList(callBack);
        })
      } else {
        console.log(list[draw_index]);
        this._drawExceptPic(list[draw_index]);
        draw_index++;
        this.setData({
          draw_index: draw_index
        })
        this._drawList(callBack);
      }
    } else {
      console.log("进入绘制回调");
      callBack && callBack()
    }

  },


  /**
   * 绘制每条信息中除去
   */
  _drawExceptPic: function(v) {
    this._drawTypeStr(v)
    this._drawTitle(v);
    this._drawDetail(v);
    this._drawContact(v);
    this._drawDate(v);
    // this._drawType(v,()=>{
    // });
    this._drawLine(); //
  },

  // /**drewType */
  _drawTypeStr: function(v) {
    myCanvas.font = 'normal bold 28px sans-serif'
    let height = this.data.height + 40;
    let canvasWidth = this.data.canvasWidth;
    let fontSize = 20;
    let str = v.is_found == 1 ? "失物招领" : "寻物启事";
    myCanvas.setFillStyle('#ffabaf');
    myCanvas.fillRect(20, height - 8, fontSize * 4, 10);
    myCanvas.setFontSize(fontSize);
    myCanvas.setFillStyle('#333');
    myCanvas.fillText(str, 20, height);
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
    console.log("裁剪成本地图片")
    console.log(that.data.height);
    setTimeout(function() {
      wx.hideLoading();
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        fileType: 'png',
        height: that.data.height,
        width: that.data.canvasWidth,
        success: function(res) {
          console.log(res.tempFilePath)
          that.setData({
            tempFile: res.tempFilePath
          })
        },
        fail: function(res) {
          console.log(res);
        },
        complete: function(res) {
          console.log(res);
        }
      }, this)
    }, 1000)
  },

  _drawDashLine() {
    console.log("绘制dashLine----------------------")
    let height = this.data.height - 30
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

  onCopy(){
    let list=this.data.list;
    let str = nowDate() + '日失物招领&寻物启事汇总\n';
    list.forEach(function(item,index){
      str+=(index+1)+'、'+item.title+'\n'
    })
     wx.setClipboardData({
       data: str,
       success:function(res){
         wx.showToast({
           title: '复制成功',
         })
       }
     })
  },


  // onDrawCanvas: function() {
  //   this.setData({ //防止连续多次按
  //     creating: true
  //   })
  //   wx.showLoading({
  //     title: '生成中',
  //   })
  //   this._downloadUserPic(() => {
  //     console.log('用户头像下载完成')
  //     this._downloadMainPic((res) => {
  //       console.log("主图下载完成")
  //       this._drawBackGround();
  //       // this._drawHeadBG();
  //       // this._drawHead();
  //       // this._drawDate();
  //       if (this.data.tempFilePath) {
  //         this._drawMainPic((res) => {
  //           this._drawRestAndSave();
  //         });
  //       } else {
  //         this._drawRestAndSave();
  //       }
  //     })
  //   })
  // },

  // /**
  //  * 绘制除主图之外的其它图片
  //  */
  // _drawRestAndSave() {
  //   this._drawTitle();
  //   this._drawDetail();
  //   this._drawContact();
  //   this._drawDate();
  //   this._drawLine();
  //   // this._drawCode();
  //   // this._drawType(() => {
  //   // });

  // },

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
   * 绘制主要图片
   * 根据图片的比例决定是否要旋转
   */
  _drawMainPic: function(imagePath, callBack) {
    let that = this;
    let canvasWidth = this.data.canvasWidth;
    wx.getImageInfo({
      src: imagePath,
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
          myCanvas.drawImage(imagePath, 0, 0, oriWidth / size, oriWidth); //绘制
          myCanvas.draw(true);
          // 还原画布
          myCanvas.translate(oriWidth / size, 0) //移动画布原点
          myCanvas.rotate(90 * Math.PI / 180) //旋转还原
          myCanvas.translate(-toLeft, -height); //移动画布原点
          height = height + oriWidth / size;
        } else {
          myCanvas.drawImage(imagePath, toLeft, height, oriWidth, oriHeight);
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
   * 下载好所有的图片然后绘制
   *  通过回调来做
   */
  _downloadMainPic: function(callBack) {
    let list = this.data.list;
    let image_index = this.data.image_index;
    console.log(image_index + '<' + list.length);
    if (image_index < list.length) {
      let goodsImages = list[image_index].images; //2绘制图片
      let that = this;
      if (goodsImages.length > 0) {
        console.log("进入图片下载")
        image_index++;
        this.setData({
          image_index: image_index
        })
        let goodsImage = goodsImages[0].url
        wx.downloadFile({
          url: goodsImage,
          success: function(res) {
            let image_list = that.data.image_list;
            image_list.push(res.tempFilePath);
            that.setData({
              image_list: image_list,
            })
            console.log("图片下载好了")
            that._downloadMainPic(callBack);
          }
        })
      } else {
        console.log("第" + image_index + "个没有图片")
        let image_list = this.data.image_list;
        image_list.push('');
        image_index++;
        that.setData({
          image_list: image_list,
          image_index: image_index
        })
        that._downloadMainPic(callBack);
      }
    } else {
      console.log(this.data.image_index + '执行回调')
      callBack && callBack(); //全部下载之后执行回调
    }
  },


  /**
   * 绘制背景图片
   */
  _drawBackGround: function() {
    let canvasWidth = this.data.canvasWidth
    // myCanvas.drawImage(this.data.whiteBackground, 0, 0, canvasWidth, 1000); //1画一个白色背景图片
    myCanvas.setFillStyle('white');
    // myCanvas.fillRect(0, 0, canvasWidth, 3000); TODO 体验版15000
    myCanvas.fillRect(0, 0, canvasWidth, 15000)
    myCanvas.draw(true); //继续绘制
  },

  /**
   * 绘制物品名称
   */
  _drawTitle: function(item) {
    let fontSize = 28;
    myCanvas.font = 'normal bold 28px sans-serif'
    myCanvas.setFontSize(fontSize);
    let height = this.data.height + 40;
    myCanvas.setFillStyle('#3a3a3a')
    let str = item.title;
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
   * 绘制详情
   */
  _drawDetail: function(item) {
    if (item.description) {
      let canvasWidth = this.data.canvasWidth;
      let height = this.data.height
      console.log(height);
      height = height + 30;
      myCanvas.setFillStyle('#3a3a3a')
      myCanvas.font = 'normal bold 20px sans-serif'
      let fontSize = 20;
      myCanvas.setFontSize(fontSize)
      let str = item.description;
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
   * 绘制联系方式
   */
  _drawContact: function(item) { //绘制联系方式
    let fontSize = 20;
    myCanvas.setFontSize(fontSize);
    myCanvas.setFillStyle('#3a3a3a');
    let canvasWidth = this.data.canvasWidth;
    let height = this.data.height
    height = height + 35;

    let str = this._beforeText(item) + ' ' + item.phone;
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
  _drawDate: function(item) {
    let height = this.data.height + 20;
    let canvasWidth = this.data.canvasWidth;
    myCanvas.setFontSize(11);
    myCanvas.setFillStyle('#8f8e8f');
    // myCanvas.setTextAlign('center');
    let str = item.user.nickName + item.updated + '发布'
    myCanvas.fillText(str, 20, height);
    myCanvas.draw(true);
    this.setData({
      height: height
    })
    myCanvas.setTextAlign('left')
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
      height: height + 20
    })
  },

  /**
   * 绘制二维码等
   */
  _drawCode: function(callBack) {
    let canvasWidth = this.data.canvasWidth;
    let height = this.data.height
    height = height + 8;
    let codeSize = 70;
    myCanvas.drawImage(this.data.code, 20, height, codeSize, codeSize); //
    myCanvas.draw(true)
    let fontSize = 12;
    myCanvas.setFontSize(fontSize);
    myCanvas.setFillStyle('#8f8e8f')
    myCanvas.setTextAlign('left');
    // height = height + codeSize / 2 - fontSize / 2
    height = height + 18;
    myCanvas.fillText("长按识别华大专属小程序发布或搜索失物信息", codeSize + 20 + 8, height);
    height = height + fontSize + 4;
    myCanvas.fillText("华大厦门失物招领台：638406214", codeSize + 20 + 8, height);
    height = height + fontSize + 4
    myCanvas.fillText("微信: 华侨大学学生资助管理中心", codeSize + 20 + 8, height);
    height = height + fontSize + 4
    myCanvas.fillText("快乐e家阳光服务队", codeSize + 20 + 8, height);
    height = height + fontSize + 4
    this.setData({
      height: height + 30
    })
    myCanvas.draw(true);
    callBack && callBack()
  },

  _drawType(item, callBack) {
    let height = this.data.height;
    let canvasWidth = this.data.canvasWidth;
    let typeHeight = 125;
    let typeWidth = 150;
    let imageType = item.is_found == 1 ? this.data.foundImage : this.data.lostImage;
    myCanvas.drawImage(imageType, canvasWidth - typeWidth, height - typeHeight, typeWidth, typeHeight);
    myCanvas.draw(true, function(e) {
      console.log('-----------------')
      callBack && callBack()
    });
  },

  /**
   * 联系方式前面的字体
   */
  _beforeText: function(item) {
    let t = ''
    if (item.is_found == 1) {
      t = '失主请'
    }
    if (item.way == 1) {
      return '领取地点：'
    }
    if (item.way == 2) {
      return t + "联系QQ："
    }
    if (item.way == 3) {
      return t + '联系微信：'
    }
    if (item.way == 4) {
      return t + '联系手机：'
    }
  }

})