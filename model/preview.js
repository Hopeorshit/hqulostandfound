// 首页Http请求
import { Base } from '../utils/base.js'
class Preview extends Base {
  constructor() {
    super();
  }
  yesterday(callBack){
    var params = {
      url: 'category/yesterday',
      sCallBack: function (res) {
        callBack && callBack(res);
      },
    };
    this.request(params);
  }
}
export {
  Preview
}