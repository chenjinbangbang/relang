let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}, //订单详情
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      detail: JSON.parse(options.detail)
    });
  },

  //核销订单
  formSubmit: function(e){
    console.log(e);
    const code = e.detail.value.code;

    app.ajax(
      'apiAuth/orderVf',
      { loginId: app.globalData.loginId, id: this.data.detail.id,vfcode: code  },
      (res) => {
        console.log(res);
        wx.showToast('核销订单成功！');
        setTimeout(() => {
          wx.navigateTo({ url: '/pages/order/detail/detail?status=2' });
        },1000);
        
      },
      (err) => { }
      );
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})