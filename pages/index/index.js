var msg, token, IMEI, filePath
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userText: "",
    syas: [],
    dialogue:'',
    height: 0,
    scrollTop: 0,
    headLeft: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1327744841,2641645709&fm=26&gp=0.jpg',
    headRight: '',
    x:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight - 100
        })
      }
    }),
    wx.getUserInfo({
      success: function (e) {
        let header = e.userInfo.avatarUrl
        that.setData({
          headRight: header
        })
      }
    }),
      setTimeout(function () {
        var grant_type = "client_credentials";
        var appKey = "7A6fuVBxIgjCCMu0eMhsxyuu";
        var appSecret = "HMxdXoT0FCGWSkgiCZQclcoHBswYyP0p";
        var url = "https://openapi.baidu.com/oauth/2.0/token"
        wx.request({
          url: url,
          data: {
            grant_type: grant_type,
            client_id: appKey,
            client_secret: appSecret
          },
          method: "GET",
          header: {
            'content-type': 'application/json' 
          },
          success: function (res) {
            token = res.data.access_token
          }
        })
      }, 0)
  },
  converSation: function (e) {
    let that = this
    console.log(that.data.dialogue)
    var obj = {},
      isay = e.detail.value.says,
      syas = that.data.syas,
      length = syas.length,
      key = 
    wx.request({
          url: 'https://www.tuling123.com/openapi/api?key=7df62848aae54641847d7e4a10e69b8b&info=' + isay,
      success: function (res) {
        let tuling = res.data.text;
        obj.robot = tuling;
        obj.isay = isay;
        syas[length] = obj;
        that.setData({
          syas: syas,
          scrollTop: that.data.scrollTop + that.data.height,
          userText: res.data.text,
          dialogue:'',
        })
          that.voice(tuling);
      }
    })
  },
  voice: function (e) {
    var that = this;
    if (e === that.data.userText) {
      var tex = that.data.userText;
    }
    else {
      var tex = e.currentTarget.dataset.text;
    }
    var texs = encodeURI(tex);
    var url = "https://tsn.baidu.com/text2audio?tex=" + texs + "&lan=zh&cuid=" + IMEI + "&ctp=" + 1 + "&tok=" + token + "&spd=" + 6
    wx.downloadFile({
      url: url,
      success: function (res) {
        filePath = res.tempFilePath;
          that.play(e);
      }
    })
  },
  play: function (e) {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = filePath
  },
  delectChat: function () {
    let that = this
    that.setData({
      syas: [
      ],
    })
  }
})