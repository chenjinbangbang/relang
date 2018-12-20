const app = getApp();
// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search: '',
    lists: [], //商品列表
    pageSize: 10,
    pageNum: 1,
    noData: true,
    //isLoading: false,
    //ajaxRequest: null
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    this.getGoods(0); 
  },

  //输入框
  searchInput: function (e) {
    this.setData({ search: e.detail.value || '' })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //搜索商品
  searchGoods(){
    this.setData({
      pageNum: 1
    });
    this.getGoods(0);
  },
  
  //获取商品列表
  getGoods(flag) { //flag：0为下拉刷新，1为上拉加载
    //console.log('加载商品');
    let data = {
      search: this.data.search,
      pageSize: 10,
      pageNum: this.data.pageNum
    };

    app.ajax(
      'api/goods',
      data,
      (res) => {
        //console.log(res);
        let data = res.data;
        data = this.handleGoods(data);
        if (flag === 0) {
          this.setData({
            lists: data
          });
          wx.stopPullDownRefresh();
        } else if (flag === 1) {
          if (data.length > 0) {
            this.setData({
              lists: this.data.lists.concat(data)
            });
          }
        }

        console.log(this.data.lists);
      },
      (err) => { },
      { login: false, wait: true, close: true }
    );
  },

  //处理商品数据
  handleGoods: function (data) {
    //需要处理抢购开始时间buystart,buyend,buytext,buyclass
    let now = Date.now().valueOf()
    for (let i = 0; i < data.length; i++) {
      let item = data[i]
      if (item.buystarttime && item.buyendtime) {
        let startTime = new Date(item.buystarttime).valueOf()
        let endTime = new Date(item.buyendtime).valueOf()
        item.buystart = item.buystarttime.substr(0, 16)
        item.buyend = item.buyendtime.substr(0, 16)
        item.mainimg = app.Config.apiPath + 'resource/' + item.mainimg;
        if (now >= startTime && now <= endTime) {
          item.buytext = "剩余" + item.stock + "份"
          item.buyclass = ""
        } else if (now > endTime) {
          item.buytext = "已结束"
          item.buyclass = "end"
        } else {
          item.buytext = "未开始~"
          item.buyclass = "end"
        }
      } else {
        if (item.buystarttime) {
          item.buystart = item.buystarttime.substr(0, 16)
        } else {
          item.buystart = "0000-00-00 00-00"
        }
        if (item.buyendtime) {
          item.buyend = item.buyendtime.substr(0, 16)
        } else {
          item.buyend = "0000-00-00 00-00"
        }
        item.buytext = "时间错误"
        item.buyclass = "end"
      }
    }
    return data
  },
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
    this.setData({
      pageNum: 1
    });
    this.getGoods(0);
  },

  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    this.setData({
      pageNum: this.data.pageNum + 1
    });
    //console.log(this.data.pageNum);
    this.getGoods(1);
  }
  
})