import { Base } from '../../utils/base.js'
class Index extends Base {
  constructor() {
    super();
  }
  categoryAll(callBack) {
    var params = {
      url: 'category/all',
      sCallBack: function (res) {
        callBack && callBack(res);
      },
    };
    this.request(params);
  }

  categoryID(categoryID,page,callBack) {
    var params = {
      url: 'category/id?categoryID='+categoryID+'&page='+page,
      sCallBack: function (res) {
        callBack && callBack(res);
      },
    };
    this.request(params);
  }

}
export { Index }