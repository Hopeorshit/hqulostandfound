/*
@Byron20180707 HTTP请求封装的基类
主要实现了在请求过程中Token过期时该如何处理
若code返回为401就重新请求Token
获得Token之后再重新请求
*/
import {Config} from '../utils/config.js'
import {Token} from '../utils/token.js'
class Base {
  constructor() {
    this.baseRequestUrl = Config.restUrl;
  }
  request(params, noRefetch) {
    var that = this;
    var url = this.baseRequestUrl + params.url;
    if (!params.method) {
      params.method = 'GET';
    }
    wx.request({
      url: url,
      data: params.data,
      method: params.method,
      header: {
         'content-type': 'application/json',
        'token': wx.getStorageSync('token'),
      },
      success: function (res) {
        var code = res.statusCode.toString();//数字变成字符串
        var startChar = code.charAt(0);
        if (startChar == 2) {
          params.sCallBack && params.sCallBack(res.data);
        }
        else {
          if (res.data.code == 401)//TODO 暂时用的code  不是用的Statu Code 所以会报500错误
          {
            if (!noRefetch) {
              that.refetch(params);
            }
          }
        }
      },
      fail: function (res) {
        params.fCallBack && params.fCallBack(res);
      }
    })
  }
  refetch(params) {
    var token = new Token();
    token.getTokenFromServer((token) => {
      this.request(params, true)//防止无限循环，如果第二次还是返回401不再重新调用
    })
  }
}

export {Base};