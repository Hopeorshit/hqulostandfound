import { Base } from '../../utils/base.js'
class MinePublish extends Base {
  constructor() {
    super();
  }
  userGoods(page,callBack) {
    var params = {
      url: 'user/goods?page='+page,
      sCallBack: function (res) {
        callBack && callBack(res);
      },
    };
    this.request(params);
  }
  goodsHandle(dataset,callBack) {
    var params = {
      url: 'goods/handle',
      sCallBack: function (res) {
        callBack && callBack(res);
      },
      method:"POST",
      data:{
        goods_id:dataset.goods_id,
        handle_type:dataset.handle_type
      }
    };
    this.request(params);
  }


}
export { MinePublish }