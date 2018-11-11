import {
  Base
} from '../../utils/base.js'
class GoodsDetail extends Base {
  constructor() {
    super();
  }
  goodsDetail(goods_id, callBack) {
    var params = {
      url: 'goods/detail?goods_id=' + goods_id,
      sCallBack: function(res) {
        callBack && callBack(res);
      },
    };
    this.request(params);
  }
  wantHandle(goods_id, callBack) {
    var params = {
      url: 'want/handle',
      sCallBack: function(res) {
        callBack && callBack(res);
      },
      method:'POST',
      data:{
        goods_id:goods_id
      }
    };
    this.request(params);
  }
  messageNew(goods_id,msg_id,content,callBack){
    var params = {
      url: 'message/new',
      sCallBack: function (res) {
        callBack && callBack(res);
      },
      method: 'POST',
      data: {
       goods_id:goods_id,
       msg_id:msg_id,
       content:content
      }
    };
    this.request(params);
  }
}
export {
  GoodsDetail
}