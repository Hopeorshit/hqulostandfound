import { Base } from '../../utils/base.js'
class PublishErShou extends Base {
  constructor() {
    super();
  }

  // encrypt(encryptedData, iv, callBack, fcallBack) {
  //   var params = {
  //     url: 'user/encrypt',
  //     sCallBack: function (res) {
  //       callBack && callBack(res);
  //     },
  //     fCallBack: function (res) {//失败的回调函数
  //       fcallBack && fcallBack(res);
  //     },
  //     method: 'POST',
  //     data: {
  //       encryptedData: encryptedData,
  //       iv: iv
  //     }
  //   };
  //   this.request(params);
  // }

  goodsCreate(is_found,way,value, callBack) {
    var params = {
      url: 'goods/new',
      sCallBack: function (res) {
        callBack && callBack(res);
      },
      method: 'POST',
      data: {
        is_found:is_found?1:0,
        description: value.description,
        phone: value.phone,
        way:way
      }
    };
    this.request(params);
  }
}
export { PublishErShou }