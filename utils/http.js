import {
  Base
} from './base.js'
// 搜索页面HTTP请求
class Search extends Base {
  constructor() {
    super();
  }
  goodsSearch(text, page, callBack) {
    var params = {
      url: 'goods/search?text=' + text + '&page=' + page,
      sCallBack: function(res) {
        callBack && callBack(res);
      },
    };
    this.request(params);
  }
}
export {
  Search
}

// 首页Http请求
class Index extends Base {
  constructor() {
    super();
  }
  categoryAll(callBack) {
    var params = {
      url: 'category/all',
      sCallBack: function(res) {
        callBack && callBack(res);
      },
    };
    this.request(params);
  }
  categoryID(categoryID, page, callBack) {
    var params = {
      url: 'category/id?categoryID=' + categoryID + '&page=' + page,
      sCallBack: function(res) {
        callBack && callBack(res);
      },
    };
    this.request(params);
  }

}
export {
  Index
}

// 地点页面请求
class Position extends Base {
  constructor() {
    super();
  }
  categoryID(categoryID, page, callBack) {
    var params = {
      url: 'category/id?categoryID=' + categoryID + '&page=' + page,
      sCallBack: function(res) {
        callBack && callBack(res);
      },
    };
    this.request(params);
  }
}
export {
  Position
}