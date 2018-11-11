// pages/zanwo.js
import {
  Config
} from '../../utils/config.js'
import {
  Infoedit
} from '../infoedit/infoedit_model.js';
var infoedit = new Infoedit();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageSource: "../../images/addPic.png",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * formBindsubmit
   */
  formBindSubmit: function(event) {
    var value = event.detail.value;
    var nickName = value.nickName;
    if (!nickName) {
      wx.showToast({
        title: '昵称不能为空',
        icon:'none'
      })
    } else {
      var that = this;
      wx.showLoading({
        title: '保存中',
      })
      var uid = this.data.userInfo.id;
      var path = this.data.imageToUpload;
      if (path == null) {
        console.log("haha");
        infoedit.edit(nickName, (res) => {
          that.editSuccess(res);
        })
      } else {
        wx.uploadFile({
          url: Config.restUrl + 'user/info_edit',
          filePath: path,
          name: 'avatar',
          formData: {
            nickName: nickName,
            uid: uid
          },
          success: function(res) {
            var Json = JSON.parse(res.data);
            that.editSuccess(Json);
          },
        })
      }
    }
  },


  /*
  选择图片上传,显示成对应的
  */
  chooseImage: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function(res) {
        that.setData({
          imageSource: res.tempFilePaths[0],
          imageToUpload: res.tempFilePaths[0],
        })
      },
    })
  },

  /**
   *修改成功之后的回调 
   */
  editSuccess: function(res) {
    console.log(res);
    wx.setStorageSync('userInfo', res.data);
    wx.hideLoading();
    wx.showToast({
      title: '修改成功',
      icon: 'success',
      duration: 2000
    })
    setTimeout(function() {
      wx.switchTab({
        url: '../mine/mine',
      })
    }, 2500)
  }

})