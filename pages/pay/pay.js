let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderPlaceData: {},
    orderPayData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(JSON.parse(options.orderPlaceData));
    if(options){
      this.setData({
        orderPlaceData: JSON.parse(options.orderPlaceData),
        orderPayData: app.globalData.orderPayData
      });
    }
    // console.log(this.data.orderPayData);
  },

  pay: function(){

    //调用微信支付接口
    wx.requestPayment({
      timeStamp: this.data.orderPayData.timeStamp,
      nonceStr: this.data.orderPayData.nonceStr,
      signType: this.data.orderPayData.signType,
      paySign: this.data.orderPayData.paySign,
      package: this.data.orderPayData.package,
      success(res) {
        wx.showToast({
          title: '支付成功',
        })
        wx.navigateTo({
          url: `/pages/order/detail/detail?id=${this.data.orderPlaceData.id}`
        });
      },
      fail(res) { }
    });
    
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
    console.log('返回');
    wx.navigateTo({
      url: `/pages/order/detail/detail?id=${this.data.orderPlaceData.id}`
    });
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