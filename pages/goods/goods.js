const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsId: null,
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    goods: {}
  },
  swiperchange(e) {
    this.setData({
      current: e.detail.current,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //console.log(options);
    this.setData({
      goodsId: options.goodsId
    });

    //获取商品详情
    this.getGoodsInfo();

    //console.log(base64Encode);
  },

  //获取商品详情
  getGoodsInfo() {
    app.ajax('api/goodsInfo', { id: this.data.goodsId }, (eResult) => {

      this.setData({
        goods: eResult.data,
        'imgUrls[0]': app.Config.apiPath + 'resource/' + eResult.data.img1,
        'imgUrls[1]': app.Config.apiPath + 'resource/' + eResult.data.img2,
        'imgUrls[2]': app.Config.apiPath + 'resource/' + eResult.data.img3,
      });
      console.log(this.data.goods);

      let WxParse = require('../../wxParse/wxParse.js');
      WxParse.wxParse('detail', 'html', decodeURIComponent(this.data.goods.detail), this, 5);

    }, (errorMsg, errorCode) => {
      console.log(errorMsg);
    }, { login: false, wait: false, close: false });
  },
  //拨打电话
  openPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.goods.shop.phone
    });
  },
  //跳转到地图
  openMap() {
    wx.navigateTo({
      url: `/pages/map/map?longitude=${this.data.goods.shop.longitude}&latitude=${this.data.goods.shop.latitude}`
    });
  },
  //立即抢购
  pay(){

    //生成订单
    app.ajax('apiAuth/orderPlace', { loginId: app.globalData.loginId, goodsId: this.data.goods.id }, (eResult) => {
      console.log(eResult);
      let orderPlaceData = eResult.data;
      
      //获取订单数据
      app.ajax(
        'apiAuth/orderPay',
        { loginId: app.globalData.loginId, id: orderPlaceData.id },
        (eResult) => {
          let orderPayData = eResult.data;
          //console.log(JSON.stringify(orderPayData));

          app.saveOrderPayData(orderPayData); //缓存支付数据，解决跳转页面传参过大的问题

          wx.navigateTo({
            url: `/pages/pay/pay?orderPlaceData=${JSON.stringify(orderPlaceData)}`
          });
        }, (err) => {}
      );
      

    }, (errorMsg, errorCode) => {
      console.log(errorMsg);
    }, { login: false, wait: false, close: false });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() { 

  },
})