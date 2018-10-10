// miniprogram/pages/project/controller/controller.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    queryResult: '',
    counterId: '',
    name: '',
    type: '',
    desc: '',
    sum: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  },

  /** 生命周期函数--监听页面初次渲染完成*/
  onReady: function() {
    let that = this;

    wx.cloud.callFunction({
      // 云函数名称
      name: 'arthurSlog_getInfo',
      // 传给云函数的参数
      data: {
        a: 7,
        b: 2,
      },
      success: function(res) {
        console.log(res.result) // 3
        that.setData({
          sum: res.result
        })

      },
      fail: console.error
    })
  },

  /*** 生命周期函数--监听页面显示*/
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

  onRead: function(e) {
    const db = wx.cloud.database()
    // 查询当前用户所有的 cars
    db.collection('cars').where({
      // _openid: this.data.openid
    }).get({
      success: res => {
        let resJson = JSON.stringify(res.data.reverse(), null, 2)
        this.setData({
          queryResult: resJson,
          counterId: res.data[0]._id
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

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
        that.setData({
          counterId: res._id,
        })
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
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
  onUpdate: function(e) {
    const db = wx.cloud.database()
    const desc = this.data.desc
    db.collection('cars').doc(this.data.counterId).update({
      data: {
        desc: desc
      },
      success: res => {
        wx.showToast({
          title: '修改记录成功',
        })
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },

  onRemove: function(e) {
    if (this.data.counterId) {
      const db = wx.cloud.database()
      db.collection('cars').doc(this.data.counterId).remove({
        success: res => {
          wx.showToast({
            title: '删除成功',
          })
          this.setData({
            counterId: '',
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
    } else {
      wx.showToast({
        title: '无记录可删，请见创建一个记录',
      })
    }
  }


})