import util from '../../../util/utils.js';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileID: '',
    title:'',
    mtype:'',
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

  bindTitleInput:function(e){
    this.setData({
      title: e.detail.value
    })
  },
  bindTypeInput:function(e){
    this.setData({
      mtype: e.detail.value
    })
  },
  doUpload:function(){
    let that = this
    var time = "banner_"+util.formatTime(new Date());
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
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
            console.log("fileID", res.fileID)
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

  commit:function(e){

    const title = this.data.title;
    const mtype = this.data.mtype;
    const fileid = this.data.fileID

    if (fileid == '' || title == '' || mtype == '' ) {
      wx.showLoading({
        title: '不能为空',
      })
      return 
    } else{
      const db = wx.cloud.database()
      db.collection('banner').add({
        data:{
          title: title,
          mtype:mtype,
          fileid:fileid
        },
        success:res=>{
          wx.showToast({
            title: '添加成功',
          })
          wx.navigateBack()
        }
      })

    }


  }
})