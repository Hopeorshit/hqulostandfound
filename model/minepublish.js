import { Base } from '../utils/base.js'
class MinePublish extends Base {
  constructor() {
    super();
  }
  userGoods(page, callBack) {
    var params = {
      url: 'user/goods?page=' + page,
      sCallBack: function (res) {
        callBack && callBack(res);
      },
    };
    this.request(params);
  }

}
export { MinePublish }