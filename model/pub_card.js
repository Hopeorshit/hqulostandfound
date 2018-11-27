import { Base } from '../utils/base.js'
class Pub_card extends Base {
  constructor() {
    super();
  }

  goodsCreate(is_found, way,student_id,value, callBack) {
    var params = {
      url: 'goods/new',
      sCallBack: function (res) {
        callBack && callBack(res);
      },
      method: 'POST',
      data: {
        is_found: is_found ? 1 : 0,
        way: way,
        title: value.title,
        student_id:student_id,
        description: value.description,
        phone: value.phone,
        is_card:1
      }
    };
    this.request(params);
  }
}
export { Pub_card }