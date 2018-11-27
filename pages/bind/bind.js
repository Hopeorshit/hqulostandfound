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
    // tips1:"绑定学号,并关注“微作校园”公众号",
    // // tips1:"作为一枚精致的大学生,经常会遇到......",
    // // tips2:"学生卡经常不翼而飞,遗失在校园的某个角落无迹可寻,补卡又费时费力。华园失物招领致力于帮您解决这个烦恼,绑定学号后,一旦平台检测到您的丢卡信息,马上会通过“微作校园”公众号给您发送通知,从此不怕丢卡"
    // tips2: "系统将主动向您发送服务通知"
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
        content: '您的填写的学号是:'+student_id,
        confirmColor:'#ff6263',
        success:function(res){
          if(res.confirm){
            http.userBind(form_id, student_id, (res) => {
              wx.showModal({
                title: '提交成功',
                content: '7天内系统检查到别人发布相关信息后,会第一时间发送给您',
                confirmText:'我知道了',
                confirmColor:'#ff6263',
                showCancel:false
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
  }

})