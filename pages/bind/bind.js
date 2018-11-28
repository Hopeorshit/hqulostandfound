// pages/bind/bind.js
import {
  Bind
} from "../../model/bind.js"
let http = new Bind();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tips1: '若拾卡人通过"扫描发布"入口',
    tips2: "发布您的学生卡,系统将在第一时间给您发送服务通知!"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  onSubmit: function(e) {
    let form_id = e.detail.formId;
    let student_id = e.detail.value.student_id;
    if (this._checkSubmit(student_id)) {
      wx.showModal({
        title: '是否确认',
        content: '您的填写的学号是:' + student_id,
        confirmColor: '#ff6263',
        success: function(res) {
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

  _checkSubmit: function(student_id) {
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