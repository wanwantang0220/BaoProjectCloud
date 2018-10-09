const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sheetList: ["新增", "修改", "删除"],
    mlist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getMlist()
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
  bindTap: function(e) {
    var data = e.currentTarget.dataset;
    console.log(data)
    let that = this
    wx.showActionSheet({
      itemList: this.data.sheetList,
      success: function(e) {
        let index = e.tapIndex
        if (index == 0) {
          that.onAdd(data)
        } else if (index == 1) {
          that.onUpdate(data)
        } else if (index == 2) {
          that.onDelete(data)
        }
      }
    })

  },

  getMlist: function() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 cars
    db.collection('cars').where({
        // _openid: this.data.openid
      }).limit(20)
      .get()
      .then(res => {
        this.setData({
          mlist: res.data,
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      })
  },
  onAdd: function(data) {
    wx.navigateTo({
      url: '../add_car/add_car',
    })

  },
  onUpdate: function(data) {},
  onDelete: function(data) {
    wx.showToast({
      title: data.index.name
    })
    let conId = data.index._id;
    let that = this;

    let currentIndex = this.data.mlist.findIndex(item => item._id === conId);
    let malllist = this.data.mlist;
    console.log("malllist = ", malllist);
    malllist.splice(currentIndex, 1)

    const db = wx.cloud.database()
    db.collection('cars').doc(conId).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
       
        that.setData({
          mlist: malllist
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })

  }

})