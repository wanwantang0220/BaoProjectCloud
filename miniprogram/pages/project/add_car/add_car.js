// miniprogram/pages/project/add_car/add_car.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    mtype: '',
    desc: '',
    flag: '1', //1:新增  2:修改
    conId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("options", options.data);
    if (options != null && options.data != undefined) {
      let data = JSON.parse(options.data);
      this.setData({
        conId: data._id,
        name: data.name,
        mtype: data.type,
        desc: data.desc,
        flag: 2
      })
    }
    console.log("name", this.data.name);

  },

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
      mtype: e.detail.value
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
      mtype: '',
      desc: ''
    })
  },
  commit: function(e) {
    if (this.data.flag == 1) {
      this.onWrite()
    } else if (this.data.flag == 2) {
      this.onUpdate()
    }

  },
  onUpdate: function() {
    let couid = this.data.conId
    let name = this.data.name
    let mtype = this.data.mtype
    let desc = this.data.desc

    const db = wx.cloud.database()
    db.collection('cars').doc(couid).update({
      data: {
        name: name,
        type: mtype,
        desc: desc
      },
      success: res => {
        wx.showToast({
          title: '修改记录成功',
        })
        wx.navigateBack({
          delta: 1
        })
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
  onWrite: function() {
    var that = this;
    const db = wx.cloud.database()
    let name = this.data.name
    let mtype = this.data.mtype
    let desc = this.data.desc
    db.collection('cars').add({
      data: {
        name: name,
        type: mtype,
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