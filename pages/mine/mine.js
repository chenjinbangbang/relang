const app = getApp()

Page({
  data: {
    userInfo: {
      nickName: '你还未登录！',
      avatarUrl: '/imgs/user.png',
    },
    order: {
      dzf: 0,//待支付
      wsy: 0//未使用
    },
    btnText: '去登录',
    //initUserInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  //跳转到订单列表
  toList: function(e){
    console.log(e);
    let status = e.currentTarget.dataset.status;

    app.changeStatus(status);
   
    wx.switchTab({
      url: '/pages/order/list/list'
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //this.setLoginView()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.isLogin()) {
      this.setLoginView()
    } else {
      this.setLogoutView()
    }
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
    if (app.isLogin()) {
      this.setLoginView()
    } else {
      this.setLogoutView()
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // orderTab: function (e) {
  //   var orderStatus = e.target.dataset ? e.target.dataset.status : '';
  //   if (orderStatus == undefined) {
  //     orderStatus = ''
  //   }
  //   app.globalData.orderStatus = orderStatus
  //   wx.switchTab({
  //     url: '/pages/order/list/list',
  //     success: function (e) {
  //       var orderPage = getCurrentPages().pop()
  //       if(orderPage){
  //         orderPage.onShow()
  //       }
  //     }
  //   })
  // },
  //退出登录
  btnTap: function (e) {
    let that = this
    if (app.isLogin()) {
      wx.showModal({
        title: '提示',
        content: '是否退出登录？',
        success: function (res) {
          if (res.confirm) {
            app.logout()
            that.setLogoutView()
          }
        }
      })
    } else {
      app.login(function () {
        that.setLoginView()
      })
    }
  },
  //点击
  userInfoTab: function (e) {
    //console.log(app.isLogin());
    if (app.isLogin()) { //已登录
      this.setLoginView();
    } else { //未登录
      wx.navigateTo({ url: '/pages/login/login' })
    }
  },
  //获取用户信息
  getUserInfo: function () {
    let that = this
    console.log('获取用户信息');

    //获取用户的当前设置
    wx.getSetting({
      success: function (res) {
        //判断用户是否允许授权
        if (res.authSetting['scope.userInfo']) {

          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              var info = res.userInfo
              console.log(JSON.stringify(info))
              app.globalData.userInfo = info
              that.setData({
                userInfo: { nickName: info.nickName, avatarUrl: info.avatarUrl },
                //initUserInfo: true
              })

            }
          })

        } else {
          that.setData({
            userInfo: { nickName: '点击获取我的信息', avatarUrl: '/imgs/user.png' },
          })
        }
      }
    })
  },
  getOrderStatusCount: function () {
    let that = this
    app.ajax('apiAuth/orderNum', function (eResult) {
      //console.log(eResult);

      that.setData({ order: eResult.data })

      //wx.stopPullDownRefresh()
    }, function (errorMsg, errorCode) {
      //wx.stopPullDownRefresh()
      app.toast(errorMsg) 
      return true
    }, { wait: false, close: false })
  },
  //当还没有登录时，我的数据显示如下
  setLogoutView: function () {
    this.setData({
      btnText: '去登录',
      order: { dzf: 0, wsy: 0 },
      userInfo: { nickName: '你还未登录！', avatarUrl: '/imgs/user.png' },
    })
  },
  //当已登录时，我的数据显示如下
  setLoginView: function () {
    this.setData({ btnText: '退出登录' })
    this.getOrderStatusCount()
    this.getUserInfo()
  }
})