//var wxpay = require('../../utils/pay.js')
var app = getApp();
Page({
  data: {
    statusType: [{
        status: 3,
        name: '全部'
      },
      {
        status: 0,
        name: '未付款'
      },
      {
        status: 1,
        name: '未使用'
      },
      {
        status: 2,
        name: '交易成功'
      },
    ],
    //statusType: ["全部", "未付款", "未使用", "交易成功"],
    statusIndex: 3,
    pageNum: 1, //当前页码
    lists: [], //订单列表

    //windowHeight: ''
  },

  onLoad(options) {
    //console.log(options);

    this.setData({
      statusIndex: app.globalData.status
    });

    //获取订单列表
    setTimeout(() => {
      this.getList(0);
    }, 1000);

    var systemInfo = wx.getSystemInfoSync()
    this.setData({
      //windowHeight: systemInfo.windowHeight,
      //currentType: options.id ? options.id : 0
    })

    //console.log(this.data.currentType);
  },
  //点击tab切换 
  changeStatus(e) {
    app.changeStatus(e.target.dataset.status); //存储订单状态

    this.setData({
      statusIndex: e.target.dataset.status,
      pageNum: 1
    });

    //获取订单列表
    this.getList(0);
  },

  //获取订单列表
  getList(flag) { //flag：0为下拉刷新，1为上拉加载
    let data = {
      loginId: app.globalData.loginId,
      pageSize: 10,
      pageNum: this.data.pageNum,
      status: this.data.statusIndex
    };
    if (this.data.statusIndex === 3) delete data.status; //为3时则全部，不传status

    app.ajax(
      'apiAuth/order',
      data,
      (res) => {
        //console.log(res);
        let data = res.data;
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
      },
      (err) => {},
      { login: false, wait: true, close: true }
    );
  },

  orderDetail: function(e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/order-details/index?id=" + orderId
    })
  },
  cancelOrderTap: function(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function(res) { 
        if (res.confirm) {
          wx.showLoading();
          wx.request({
            url: app.globalData.baseUrl + '/order/close',
            data: {
              token: app.globalData.token,
              orderId: orderId
            },
            success: (res) => {
              wx.hideLoading();
              if (res.data.code == 0) {
                var param = {},
                  str = 'statusType[' + that.data.currentType + '].page';
                param[str] = 0;
                that.getList();
              }
            }
          })
        }
      }
    })
  },

  toPayTap: function(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    var money = e.currentTarget.dataset.money;
    wx.request({
      url: app.globalData.baseUrl + '/user/amount',
      data: {
        token: app.globalData.token
      },
      success: function(res) {
        if (res.data.code == 0) {
          // res.data.data.balance
          money = money - res.data.data.balance;
          if (money <= 0) {
            // 直接使用余额支付
            wx.request({
              url: app.globalData.baseUrl + '/order/pay',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                token: app.globalData.token,
                orderId: orderId
              },
              success: function(res2) {
                wx.reLaunch({
                  url: "/pages/order-list/index"
                });
              }
            })
          } else {
            //wxpay.wxpay(app, money, orderId, "/pages/order-list/index");
          }
        } else {
          wx.showModal({
            title: '错误',
            content: '无法获取用户资金信息',
            showCancel: false
          })
        }
      }
    })
    //wxpay.wxpay(app, money, orderId, "/pages/order-list/index");
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      statusIndex: Number(app.globalData.status)
    });

    //获取订单列表
    //setTimeout(() => {
      this.getList(0);
    //}, 1000);
  },

  onHide: function() {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function() {
    // 生命周期函数--监听页面卸载
  },
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {
    this.setData({
      pageNum: 1
    });
    this.getList(0);
  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function() {
    this.setData({
      pageNum: this.data.pageNum + 1
    });
    //console.log(this.data.pageNum);
    this.getList(1);
  }
})