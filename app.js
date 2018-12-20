import md5 from 'utils/md5.js' 
const util = require('utils/util.js')
//app.js
App({
  onLaunch: function () {
    this.login()
  },
  globalData: {
    //userInfo: null,
    code: '',
    token: '',
    loginId: '',
    authorization: 'Bearer;',

    status: 3, //订单状态
    orderPayData: {}, //存储支付数据
  },
  Config: {
    serverPath: "https://www.hotwave.xyz",//根路径
    apiPath: 'https://www.hotwave.xyz/', //API路径
  },
  NetError: {
    NODATA: -2, //没有数据
    SERVER: -1, //服务器错误
    ERROR: 0, //普通错误
    SUCCESS: 1, //成功
    LOGOUT: 700, //登录过期
    SERVER_MSG: '网络请求失败'
  },
  ajaxOptions: {
    close: true,
    wait: true,
    login: true
  },
  signRequestData: function (data, signKey) {
    let dataJson = util.base64Encode(JSON.stringify(data))
    let md5Sign = md5(dataJson + signKey);
    return { 'object': dataJson, 'sign': md5Sign }
  },
  ajax: function (path, data, successCallback, errorCallback, options) {
    //判断是否是商品列表或商品详情，不是则判断是否登录
    if (/api\/goods|api\/goodsInfo/.test(path)){
      this.ajaxApi(path, data, successCallback, errorCallback, options);
    }else{
      //console.log('存在token：' + this.isLogin());
      if (this.isLogin()) { //已登录
        data.loginId = this.globalData.loginId
        this.ajaxApi(path, data, successCallback, errorCallback, options);
      }else{ //未登录，跳转到登录
        wx.navigateTo({ url: '/pages/login/login' });
      }
    }
  },
  ajaxApi: function (path, data, successCallback, errorCallback, options){
    let that = this;
    //console.log(data);
    if (typeof data === "function") {
      options = errorCallback
      errorCallback = successCallback
      successCallback = data
      data = {} 
    }
    if (typeof errorCallback === "object") {
      options = errorCallback
    }
    var ajaxOptions = Object.assign(that.ajaxOptions, options)
    if (ajaxOptions.wait) {
      if (typeof ajaxOptions.wait === "string") {
        wx.showLoading({ title: ajaxOptions.wait })
      } else {
        wx.showLoading({ title: '加载中...' })
      }
    }
    let requestUrl, requestHeader = {
      'content-type': 'application/json',
      'authorization': that.globalData.authorization
    }

    requestUrl = that.Config.apiPath + path

    
    return wx.request({
      url: requestUrl,
      data: data,
      method: 'POST',
      dataType: 'json',
      header: requestHeader,
      success: function (wxResult) {
        let res = wxResult.data;
        if (res.code == that.NetError.SUCCESS) {
          ajaxOptions.close && wx.hideLoading()
          typeof successCallback === "function" && successCallback(res);
        } else {
          wx.hideLoading()
          if (typeof errorCallback !== "function" || !errorCallback(res.message, res.code)) {
            if (res.code == that.NetError.LOGOUT) {
              wx.showModal({
                title: '登录过期',
                content: '现在去登录',
                success: function () {
                  wx.navigateTo({ url: '/pages/login/login' })
                }
              })
            } else {
              wx.showModal({ title: '提示', content: res.message })
            }
          }
        }
      },
      fail: function (err) {
        wx.hideLoading()
        if (typeof errorCallback !== "function" || !errorCallback(that.NetError.SERVER, that.NetError.SERVER_MSG)) {
          wx.showModal({ title: '提示', content: that.NetError.SERVER_MSG })
        }
      }
    })
  },
  auth: function (successCallback, errorCallback) {
    let that = this
    wx.showLoading({ title: '正在登录...' })
    wx.request({
      url: that.Config.apiPath + 'api/wxLogin',
      data: { code: that.globalData.code },
      method: 'POST',
      dataType: 'json',
      header: { 'content-type': 'application/json' },
      success: function (wxResult) {
        wx.hideLoading()
        let res = wxResult.data;
        if (res.code == that.NetError.SUCCESS) {
          var eData = res.data
          that.globalData.code = eData.code
          that.globalData.token = eData.token
          that.globalData.loginId = eData.loginId
          that.globalData.authorization = 'Bearer;' + eData.token
          wx.showToast({ title: '登录成功！' })

          typeof successCallback === "function" && successCallback(res);
          
        } else {
          if (typeof errorCallback !== "function" || !errorCallback(res.message, res.code)) {
            wx.showModal({ title: '提示', content: res.message })
          }
        }
      },
      fail: function (err) {
        wx.hideLoading()
        if (typeof errorCallback !== "function" || !errorCallback(that.NetError.SERVER, that.NetError.SERVER_MSG)) {
          wx.showModal({ title: '提示', content: that.NetError.SERVER_MSG })
        }
      }
    })
  },
  logout: function () {
    this.globalData.code = null
    this.globalData.token = null
    this.globalData.loginId = null
    this.globalData.authorization = null
  },
  isLogin: function () {
    return this.globalData.token
  },
  login: function (successCallback) {
    let that = this
    if (that.globalData.code) { //code是否存在
      //检查用户当前session_key是否有效
      wx.checkSession({
        success: function () {
          that.auth(successCallback)
        },
        fail: function () {
          wx.login({
            success: function (res) {
              if (res.code) {
                that.globalData.code = res.code
                that.auth(successCallback)
              } else {
                that.toast('登录失败！' + res.errMsg)
              }
            }
          })
        }
      })
    } else {
      //获取临时登录凭证（code）
      wx.login({
        success: function (res) {
          if (res.code) {
            that.globalData.code = res.code
            that.auth(successCallback)
          } else {
            that.toast('登录失败！' + res.errMsg)
          }
        }
      });
    }
  },
  //缓存支付数据
  saveOrderPayData: function(data){
    this.globalData.orderPayData = data;
  },
  //存储订单状态
  changeStatus: function (data){
    this.globalData.status = data;
  },

  //提示
  toast: function (msg) {
    wx.showToast({
      icon: 'none',
      title: msg,
    })
  },

  //提示成功
  tipSuccess:function(msg){
    wx.showToast({
      icon: 'success',
      title: msg,
    })
  }
})