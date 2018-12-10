// pages/pub_card/pub_card.js
import {
  Pub_card
} from "../../model/pub_card.js"
import {
  Config
} from '../../utils/config.js'
var http = new Pub_card();
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    localImage: null //本地临时图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._initData();
  },

  _initData() {
    this.setData({
      publishing: false,
      description: null,
      phone: null,
      name: null,
      student_id: null,
      institute: null,
      localImage: null,
      is_found:true,
      tips1:"发布您的学生卡,系统将在第一时间给您发送服务通知!"
    })
    this._initRadio();
  },


  /**
   * 初始化radio
   */
  _initRadio: function() {
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
  },
  /**
   * 点击radio
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

  /*
   *点击拍照
   */
  onPic: function() {
    let that = this;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        that.setData({
          localImage: res.tempFilePaths[0]
        })
        that._upload();
      },
    })
  },
  /**
   * 图片上传,并进行Ocr调用
   * 采用百度Ocr,但百度存在方向问题
   */
  _upload: function() {
    wx.showLoading({
      title: '识别中,请稍候',
    })
    let that = this;
    wx.uploadFile({
      url: Config.restUrl + 'goods/ocr',
      filePath: this.data.localImage,
      name: 'image',
      success: function(res) {
        that.setData({
          ocr: JSON.parse(res.data)
        })
        // wx.setStorageSync(key, that.data.ocr.words_result);
        that._getInfo();
        wx.hideLoading();
        that._toastRes();
      },
      complete: function() {
        // wx.hideLoading();
      }
    })
  },
  /**
   * 根据检测结构进行正则匹配
   */
  _getInfo: function() {
    // let words = this.data.ocr.words_result; 百度API
    let words = this.data.ocr.data.item_list
    let that = this;
    // let key='words';;
    let key = 'itemstring'
    words.forEach(function(item, index) {
      console.log(item);
      if (/姓名/.test(item[key])) {
        that.setData({
          // 'name': item[key].match(/[:：](\S*)性别/)[1] 百度API
          name: item[key].match(/[^姓名:：][\u4e00-\u9fa5]+/g)[0]
        })
      }
      if (/学号/.test(item[key])) {
        that.setData({
          student_id: item[key].match(/\d+/g)[0]
        })
      }
      if (/学院/.test(item[key])) {
        that.setData({
          institute: item[key].match(/[^学院:：][\u4e00-\u9fa5]+/g)[0]
        })
      }
    })
  },

  /**
   * 点击提交
   */
  onSubmit: function(e) {
    console.log(e)
    if (this._checkSubmit(e.detail.value)) {
      this.setData({
        publishing: true
      })
      var radio_group = this.data.radio_group;
      var currentRadioIndex = this.data.currentRadioIndex;
      var way = radio_group[currentRadioIndex].way;
      let value = e.detail.value;
      value.title = value.institute+value.name + '的' + '学生卡'
      value.description = '';
      http.goodsCreate(1, way, this.data.student_id, e.detail.value, (res) => {
        this.setData({
          goods_id: res.data.goods_id
        })
        this._successReturn();
      });
    }
  },
  /**
   * 发布成功之后返回
   */

  _successReturn: function() {
    wx.hideLoading();
    wx.showToast({
      title: '发布成功',
    })
    var that = this;
    that._initData();
    app.globalData.indexRefresh = true;
    setTimeout(function() {
      wx.redirectTo({
        url: '/pages/goodsdetail/goodsdetail?goods_id=' + that.data.goods_id,
      })
    }, 1500)
  },

  /**
   * 发布有效性检测
   */
  _checkSubmit: function(value) {
    if (!value.name) {
      wx.showToast({
        title: '请填写对方的姓名',
        icon: 'none'
      })
      return false
    }
    if (!value.name) {
      wx.showToast({
        title: '请填写学号',
        icon: 'none'
      })
      return false
    }
    if (!value.name) {
      wx.showToast({
        title: '请填写学院',
        icon: 'none'
      })
      return false
    }
    if (!value.phone) {
      wx.showToast({
        title: '记得填写领取方式呦',
        icon: 'none'
      })
      return false
    }
    return true;
  },

  /**
   * 检测 结果提示
   */
  _toastRes: function() {
    let tip = '';
    let tipBool = false;
    if (!this.data.name) {
      tip += '姓名 '
      tipBool = true
    }
    if (!this.data.student_id) {
      tip += '学号 '
      tipBool = true
    }
    if (!this.data.institute) {
      tip += '学院 '
      tipBool = true
    }
    if (tip) {
      wx.showToast({
        title: tip + ' 检测失败,请手动输入',
        icon:'none',
        duration:2000
      })
    }else{
      wx.showToast({
        title: '检测完成',
      })
    }
  },

  /**
   * 选择类型
   */
  typeSelect: function () {
    this.setData({
      is_found: !this.data.is_found,
    })
  },
   
  /**
   * 提交
   */ 
  onListenSubmit: function (e) {
    let form_id = e.detail.formId;
    let student_id = e.detail.value.student_id;
    if (this._checkListenSubmit(student_id)) {
      wx.showModal({
        title: '是否确认',
        content: '您的填写的学号是:' + student_id,
        confirmColor: '#ff6263',
        success: function (res) {
          if (res.confirm) {
            http.userBind(form_id, student_id, (res) => {
              wx.showModal({
                title: '提交成功',
                content: '监听成功！由于微信formID有效期为7天,超出时间您只需要在本页面再次监听即可。',
                confirmText: '我知道了',
                confirmColor: '#ff6263',
                showCancel: false
              })
            })
          }
        }
      })
    }
  },
  /**
   * 检测学号输入
   */
  _checkListenSubmit: function (student_id) {
    if (!student_id) {
      wx.showToast({
        title: '请填写学号',
        icon: 'none'
      })
      return false;
    }
    return true;
  },
  /**
   * 了解扫描发布页面
   */
  onPub_card: function () {
    wx.navigateTo({
      url: '/pages/pub_card/pub_card',
    })
  }
})