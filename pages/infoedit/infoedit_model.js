import { Base } from '../../utils/base.js'

class Infoedit extends Base {
  constructor() {
    super();
  }
  edit(nickName,callBack) {
    var params = {
      url: 'user/info_edit_n',
      sCallBack: function (res) {
        callBack && callBack(res);
      },
      method:"POST",
      data:{
        nickName:nickName,
      }
    };
    this.request(params);
  }

}
export { Infoedit }