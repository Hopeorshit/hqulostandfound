import { Base } from '../utils/base.js'
class Publish extends Base {
  constructor() {
    super();
  }

  goodsCreate(is_found, way, value, callBack) {
    var params = {
      url: 'goods/new',
      sCallBack: function (res) {
        callBack && callBack(res);
      },
      method: 'POST',
      data: {
        is_found: is_found ? 1 : 0,
        description: value.description,
        phone: value.phone,
        way: way
      }
    };
    this.request(params);
  }
}
export { Publish }