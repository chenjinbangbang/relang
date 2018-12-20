const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {   
    orderId: null, //订单id
    detail: {}, //订单详情

    //isPay: 1, //0:未付款，显示立即支付，1：未使用，显示立即使用，2：交易成功，显示已使用文字，3：交易关闭，显示交易关闭文字，4：已过期，显示已过期文字
    //time: '2018-08-20 13:33:10', //支付过期时间
    leftTime: '' //过期倒计时
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    // console.log(new Date('2018/10/10 10:10:10'));
    // console.log(new Date('2018/10/10'));
    // console.log(Date.parse(new Date('2018/10/10 10:10:10')));
    // console.log(new Date('2018/10/10 10:10:10').getTime());
    // console.log(new Date('2018-10-10'));
    // console.log(new Date('2018-10-10 10:10:10'));

    if(options.id){
      this.setData({
        orderId: options.id
      });

      //获取订单详情
      setTimeout(() => {
        this.getOrderInfo();
      },1000);
    }

    //核销订单成功返回到这里，把status变成2：已使用
    if(options.status){
      this.setData({
        'detail.status': options.status
      });
    }

  },
  //获取订单详情
  getOrderInfo: function(){
    app.ajax(
      'apiAuth/orderInfo', 
      { loginId: app.globalData.loginId, id: this.data.orderId},
      (res) => {
        //console.log(res);

        this.setData({
          detail: res.data,
          'detail.goodsimg': app.Config.apiPath + 'resource/' + res.data.goodsimg
        });
        console.log(this.data.detail);

        if (this.data.detail.status === 0) {
          
          this.countdownFn();
        }

      },
      (err) => {}
      );
  },
  //过期倒计时
  countdownFn() {
    let days, hours, minutes, seconds;
    let timeInterval = setInterval(() => {
     
      let leftTime = (new Date(this.data.detail.useendtime.replace(/-/g,'/')).getTime() - new Date().getTime()) / 1000;
      //console.log(leftTime);
      if (leftTime > 0) {
        days = this.checkTime(parseInt(leftTime / 60 / 60 / 24));
        hours = this.checkTime(parseInt(leftTime / 60 / 60 % 24));
        minutes = this.checkTime(parseInt(leftTime / 60 % 60));
        seconds = this.checkTime(parseInt(leftTime % 60));

        this.setData({
          leftTime: `${days}天${hours}时${minutes}分${seconds}秒`
        });
        //console.log(this.data.leftTime);
      } else {
        this.setData({
          'detail.status': 4,
          leftTime: ''
        });
        clearInterval(timeInterval);
      }
    }, 1000);

  },
  //格式化时间
  checkTime(i) {
    return i < 10 ? `0${i}` : i;
  },
  //跳转到核销码
  toVerify() {
    wx.navigateTo({
      url: `/pages/order/verify/verify?detail=${JSON.stringify(this.data.detail)}`
    });
  },
  //取消订单
  cancel(){


    wx.showModal({
      title: '提示',
      content: '是否申请取消订单？',
      cancelText: '我再想想',
      confirmText: '立即取消',
      success: (res) => {
        if (res.confirm) {
          
          app.ajax(
            'apiAuth/orderCancel', 
            { loginId: app.globalData.loginId, id: this.data.orderId},
            (res) => {
              console.log(res);

              app.tipSuccess('取消成功');
              setTimeout(() => {
                wx.navigateBack({ delta: 1 });
              },1000);
            },
            (err) => {},
            { login: false, wait: true, close: true }
            );
        } else {
          
        }
      },
    });
  },

  //支付
  pay(){

    //获取订单数据
    app.ajax(
      'apiAuth/orderPay',
      { loginId: app.globalData.loginId, id: this.data.orderId },
      (eResult) => {
        let orderPayData = eResult.data;

        //调用微信支付接口
        wx.requestPayment({
          timeStamp: orderPayData.timeStamp,
          nonceStr: orderPayData.nonceStr,
          signType: orderPayData.signType,
          paySign: orderPayData.paySign,
          package: orderPayData.package,
          success(res) {
            console.log(res);

            app.tipSuccess('支付成功');
            setTimeout(() => {
              wx.navigateBack({ delta: 1 });
            }, 1000);
          },
          fail(res) { }
        });

      }, (err) => {},
      { login: false, wait: true, close: true }
    );

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