// pages/authorize/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  bindGetUserInfo: function (e) {
    
    let info = e.detail.userInfo
    if (!info) {
      wx.showModal({
        title: '提示',
        content: '获取我的信息失败',
      })
      return;
    }
    // var updateData = {
    //   id: app.globalData.accountId,
    //   name: info.nickName,
    //   iconpath: info.avatarUrl
    // }
    // app.ajax('updateAccount', updateData, function (eResult) {
    //   app.globalData.userInfo = info
    //   app.tipSuccess('更新成功')
    //   wx.navigateBack({ delta: 1 })
    // }, { wait: '正在更新...' })
    console.log(e);

    app.login(
      (res) => {
        app.ajax(
          'apiAuth/updateAccountInfo',
          { loginId: app.globalData.loginId, iconpath: info.avatarUrl, name: encodeURIComponent(info.nickName) },
          (res) => {
            console.log(res);

            wx.navigateBack({ delta: 1 });
          },
          (err) => { }
        );
      }
    );
    

  }
})