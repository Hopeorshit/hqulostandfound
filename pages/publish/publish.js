import {
  Publish
} from "../../model/publish.js"
import {
  Config
} from '../../utils/config.js'
var http = new Publish();
var app = getApp();
Page({
  data:{
   is_found:true
  },
  onLoad: function() {
    this.initRadio(),
    this.initData()
  },
  initRadio: function() {
    if (this.data.is_found) {
      this.setData({
        radio_group: [{
            text: "指定地点",
            way: 1,
            checked: true
          }, {
            text: "qq",
            way: 2,
            checked: false
          }, {
            text: "微信",
            way: 3,
            checked: false
          },
          {
            text: "手机",
            way: 4,
            checked: false
          }
        ],
        currentRadioIndex: 0
      })
    } else {
      this.setData({
        radio_group: [{
            text: "qq",
            way: 2,
            checked: true
          }, {
            text: "微信",
            way: 3,
            checked: false
          },
          {
            text: "手机",
            way: 4,
            checked: false
          }
        ],
        currentRadioIndex: 0
      })
    }
  },
  initData(){
    this.setData({
      publishing: false,
      description: null,
      phone: null,
      localImage: [],
      imageIndex: 0,
      // is_found:false
    })
  },
  onShow: function() {
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
     
    }
  },
  //点击选择图片
  addPic: function() {
    var that = this;
    wx.chooseImage({
      count: 6,
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        var localImage = that.data.localImage;
        tempFilePaths.forEach(function(item) {
          localImage.push(item);
        })
        that.setData({
          localImage: localImage,
        })
      },
    })
  },
  // 点击删除图片
  deletePic: function(e) {
    var localImage = this.data.localImage;
    var index = e.currentTarget.dataset.index;
    localImage.splice(index, 1);
    this.setData({
      localImage: localImage,
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
  submit: function(e) {
    console.log(e)
    if (this.checkSubmit(e.detail.value)) {
      this.setData({
        publishing: true
      })
      var radio_group = this.data.radio_group;
      var currentRadioIndex = this.data.currentRadioIndex;
      var way = radio_group[currentRadioIndex].way;
      console.log(way);
      http.goodsCreate(this.data.is_found, way, e.detail.value, (res) => {
        this.setData({
          goods_id:res.data.goods_id
        })
        var localImage = this.data.localImage
        if (localImage.length > 0) {
          this.uploadPic(res.data)
        } else {
          this.successReturn();
        }
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
          that.successReturn();
        }
      },
      fail: function(res) {
        wx.hideLoading();
        that.initData();
      },
    })
  },
  //发布有效性检测
  checkSubmit: function(value) {
    var localImage = this.data.localImage;
    var description = value.description;
    var phone = value.phone;
    if (!description) {
      wx.showToast({
        title: '请填写物品名称和特征',
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
    return true;
  },
  // 选择发布信息的类型
  typeSelect: function() {
    this.setData({
      is_found: !this.data.is_found,
    })
    this.initRadio()
  },
  successReturn: function() {
    wx.hideLoading();
    wx.showToast({
      title: '发布成功',
    })
    var that = this;
    that.initData();
    app.globalData.indexRefresh = true;
    setTimeout(function() {
      wx.navigateTo({
        url: '/pages/goodsdetail/goodsdetail?goods_id='+that.data.goods_id,
      })
    }, 1500)
  },
  radioChange: function(e) {
    this.setData({
      currentRadioIndex: e.detail.value
    })
  }

})