import { Base } from '../utils/base.js'
// 地点页面请求
class Date extends Base {
  constructor() {
    super();
  }
  categoryID(categoryID, page, callBack) {
    var params = {
      url: 'category/id?categoryID=' + categoryID + '&page=' + page,
      sCallBack: function (res) {
        callBack && callBack(res);
      },
    };
    this.request(params);
  }
}
export {
  Date
}