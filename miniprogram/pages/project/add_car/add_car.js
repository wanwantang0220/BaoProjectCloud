// miniprogram/pages/project/add_car/add_car.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    type: '',
    desc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  bindNameInput: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindTypeInput: function(e) {
    this.setData({
      type: e.detail.value
    })
  },
  bindDescInput: function(e) {
    this.setData({
      desc: e.detail.value
    })
  },
  formReset: function(e) {
    this.setData({
      name: '',
      type: '',
      desc: ''
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},

  onWrite: function(e) {
    var that = this;
    const db = wx.cloud.database()
    let name = this.data.name
    let type = this.data.type
    let desc = this.data.desc
    db.collection('cars').add({
      data: {
        name: name,
        type: type,
        desc: desc
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '新增记录成功',
        })
        wx.navigateBack({
          delta: 1
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
})