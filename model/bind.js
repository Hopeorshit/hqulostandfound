import { Base } from '../utils/base.js'
class Bind extends Base {
  constructor() {
    super();
  }

  userBind(form_id, student_id, callBack) {
    var params = {
      url: 'user/bind',
      sCallBack: function (res) {
        callBack && callBack(res);
      },
      method: 'POST',
      data: {
        student_id: student_id,
        form_id: form_id,
      }
    };
    this.request(params);
  }
}
export { Bind }