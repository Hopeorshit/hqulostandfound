const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const randomStr = function generateMixed(n) {
  var res = "";
  for (var i = 0; i < n; i++) {
    var id = Math.ceil(Math.random() * 35); //Math.ceil浮点数向上取整数
    res += chars[id];
  }
  return res;
}

const loginTip = function loginTip() {
  wx.showModal({
    title: '温馨提示',
    content: '使用这个功能，需要先登录哦',
    confirmText: "前去登录",
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
}

module.exports = {
  randomStr: randomStr,
  loginTip:loginTip
}