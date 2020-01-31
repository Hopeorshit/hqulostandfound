import {
  Publish
} from "../../model/publish.js"
import {
  Config
} from '../../utils/config.js'
var http = new Publish();
let app = getApp();
Page({
  data: {

  },
  onLoad: function() {
    this.initData(),
      this.initWxData();
  },
  initRadio: function() {
    if (this.data.is_found) {
      this.setData({
        radio_group: [{
            text: "指定领取地点",
            way: 1,
            checked: true
          }, {
            text: "联系qq",
            way: 2,
            checked: false
          },
          {
            text: "联系手机",
            way: 4,
            checked: false
          }
        ],
        currentRadioIndex: 0
      })
    } else {
      this.setData({
        radio_group: [{
            text: "联系qq",
            way: 2,
            checked: true
          },
          {
            text: "联系手机",
            way: 4,
            checked: false
          }
        ],
        currentRadioIndex: 0
      })
    }
  },
  initData() {
    this.setData({
      publishing: false,
      description: null,
      phone: null,
      localImage: [], //本地图片
      imageIndex: 0, //本地图片数组
      is_found: 1,
      title: null
      // is_found:false
    })
    this.initRadio();
  },
  /**
   * 用于
   */
  initWxData() {
    this.setData({
      wxLocalImage: [], //本地图片
      wxImageIndex: 0, //本地图片数组
    })
  },

  //点击选择图片
  onAddPic: function() {
    var that = this;
    wx.chooseImage({
      count: 6,
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        var localImage = that.data.localImage;
        var wxLocalImage = that.data.wxLocalImage;
        tempFilePaths.forEach(function(item) {
          localImage.push(item);
          wxLocalImage.push(item);
        })
        that.setData({
          localImage: localImage,
          wxLocalImage: wxLocalImage
        })
      },
    })
  },
  // 点击删除图片
  deletePic: function(e) {
    var index = e.currentTarget.dataset.index;
    var localImage = this.data.localImage;
    localImage.splice(index, 1);
    var wxLocalImage = this.data.wxLocalImage;
    wxLocalImage.splice(index, 1);
    this.setData({
      localImage: localImage,
      wxLocalImage: wxLocalImage
    })
  },
  //点击查看大图
  imagePreview: function(e) { //图片预览
    console.log(e);
    var images = [];
    var index = e.currentTarget.dataset.index;
    var localImage = this.data.localImage;
    for (var i = 0; i < localImage.length; i++) {
      images[i] = localImage[i];
    }
    wx.previewImage({
      urls: images,
      current: localImage[index]
    })
  },
  //点击提交
  onSubmit: function(e) {
    console.log(e)
    if (this._checkSubmit(e.detail.value)) {
      this.setData({
        publishing: true
      })
      var radio_group = this.data.radio_group;
      var currentRadioIndex = this.data.currentRadioIndex;
      var way = radio_group[currentRadioIndex].way;
      console.log(way);
      http.goodsCreate(this.data.is_found, way, e.detail.value, (res) => {
        this._wxLost(this.data.is_found, way, e.detail.value)
        console.log(res)
        if (res.code == 201) {
          this.setData({
            goods_id: res.data.goods_id
          })
          var localImage = this.data.localImage
          if (localImage.length > 0) {
            this.uploadPic(res.data)
          } else {
            this._successReturn()
          }
        } else {
          wx.showToast({
            title: '内容违规',
            icon: 'none'
          })
        }
        this.initData();
      });
    }

  },
  // 图片上传函数
  uploadPic: function(data) {
    var that = this;
    var localImage = that.data.localImage;
    var imageIndex = that.data.imageIndex;
    wx.showLoading({
      title: '上传第' + (imageIndex + 1) + '张图片',
    })
    wx.uploadFile({
      url: Config.restUrl + 'goods/image_upload',
      filePath: localImage[imageIndex],
      name: 'image',
      formData: {
        goods_id: data.goods_id,
        uid: data.uid,
        ishead: imageIndex == 0 ? true : false
      },
      success: function(res) {
        that.setData({
          imageIndex: imageIndex + 1,
        })
        if (localImage[imageIndex + 1]) {
          that.uploadPic(data);
        } else {
          that._successReturn();
        }
      },
      fail: function(res) {
        wx.hideLoading();
        that.initData();
      },
    })
  },
  //发布有效性检测
  _checkSubmit: function(value) {

    let title = value.title;
    let phone = value.phone;
    if (!title) {
      wx.showToast({
        title: '请填写物品名称',
        icon: 'none'
      })
      return false
    }
    if (!phone) {
      wx.showToast({
        title: '记得填写领取/联系方式呦',
        icon: 'none'
      })
      return false
    }
    let currentRadioIndex = this.data.currentRadioIndex;
    let way = this.data.radio_group[currentRadioIndex].way;
    if (way == 2) {
      if (!/^[1-9][0-9]{4,}$/.test(phone)) {
        wx.showToast({
          title: '请填入正确的qq号',
          icon: 'none'
        })
        return false
      }
    }
    if (way == 4) {
      if (!/^1[123456789]\d{9}$/.test(value.phone)) {
        wx.showToast({
          title: '请填入正确的手机号',
          icon: 'none'
        })
        return false
      }
    }
    return true;
  },

  // 选择发布信息的类型
  typeSelect: function() {
    this.setData({
      is_found: this.data.is_found == 1 ? 0 : 1,
    })
    this.initRadio()
  },
  _successReturn: function() {
    wx.hideLoading();
    wx.showToast({
      title: '发布成功',
    })
    var that = this;
    let is_found = this.data.is_found;
    app.globalData.indexRefresh = true;
    setTimeout(function() {
      wx.navigateTo({
        url: '/pages/goodsdetail/goodsdetail?goods_id=' + that.data.goods_id + '&is_found=' + is_found,
      })
      that.initData();
    }, 1500)
  },
  /**
   * 点击选择类型
   */
  onRadio: function(e) {
    let index = e.currentTarget.dataset.index;
    let radio_group = this.data.radio_group;
    radio_group.forEach(function(item, i_index) {
      if (index == i_index) {
        item.checked = true
      } else {
        item.checked = false
      }
    })
    this.setData({
      currentRadioIndex: index,
      radio_group: radio_group
    })
  },

  /**
   *
   */
  _wxLost(is_found, way, value) {
    let that = this;
    wx.request({
      url: 'https://hqupool.wechatzp.com/v3/lost/wx_new',
      method: 'POST',
      data: {
        is_found: is_found ? 1 : 0,
        title: value.title,
        description: value.description,
        phone: value.phone,
        way: way,
        is_card: 0
      },
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        console.log(res);
        var wxLocalImage = that.data.wxLocalImage;
        if (wxLocalImage.length > 0) {
          that._wxUpPic(res.data.data)
        }
      }
    })
  },
  /**
   * 
   */
  _wxUpPic(data) {
    var that = this;
    var wxLocalImage = that.data.wxLocalImage;
    var wxImageIndex = that.data.wxImageIndex;
    wx.uploadFile({
      url: 'https://hqupool.wechatzp.com/v3/lost/image_upload',
      filePath: wxLocalImage[wxImageIndex],
      name: 'image',
      formData: {
        goods_id: data.goods_id,
        uid: data.uid,
        ishead: wxImageIndex == 0 ? true : false
      },
      success: function(res) {
        that.setData({
          wxImageIndex: wxImageIndex + 1,
        })
        if (wxLocalImage[wxImageIndex + 1]) {
          that._wxUpPic(data);
        } else {
          that.initWxData()
        }
      }
    })
  }

})