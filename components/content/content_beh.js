let contentBeh = Behavior({
  properties: {

  },
  data: {
    content:{
      page_size: 10,
      page: 1,
      more: true,
      empty: false,
      list: []
    }
  },

  methods: {
    setMoreData: function(resContent) { //上拉刷新的时候触发
      let content = this.data.content;
      let contentList = content.list;
      let data = resContent;
      let dataList=data.list;
      dataList.forEach(v=>{
        v['selected']=false;
      })
      console.log("setMoreData");
      console.log(dataList);
      content.list = contentList.concat(dataList);
      content.more = data.list.length == content.page_size ? true : false;
      content.page = content.page + 1;
      content.empty = content.list.length > 0 ? false : true,
        this.setData({
          content: content,
        })
      console.log(this.data.content);
    },
    more: function() { //返回是否还有更多
      return this.data.content.more
    },
    empty: function() { //返回是否为空
      return this.data.content.empty
    },
    initContent: function() { //初始化页面的时候触发
      this.setData({
        content: {
          page_size: 10,
          page: 1,
          more: true,
          empty: false,
          list: []
        }
      })
    }
  }
})


export {
  contentBeh
}