import util from '../../../util/utils.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    mtype: '',
    desc: '',
    flag: '1', //1:新增  2:修改
    conId: '',
    fileID: '',
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
    let fileid = this.data.fileID

    if (fileid == '' || name == '' || mtype == '' || desc == '') {
      return
    } else {
      db.collection('cars').add({
        data: {
          name: name,
          type: mtype,
          desc: desc,
          fileid: fileid
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
    }
  },
  // 上传图片
  doUpload: function() {
    let that = this
    var time = util.formatTime(new Date());
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        // 上传图片
        const cloudPath = time + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            wx.showToast({
              title: '[上传文件] 成功',
            })

            that.setData({
              fileID: res.fileID
            })
            // app.globalData.fileID = res.fileID
            // app.globalData.cloudPath = cloudPath
            // app.globalData.imagePath = filePath

            // wx.navigateTo({
            //   url: '../storageConsole/storageConsole'
            // })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
})