
import bannerdata from '../../data/banner_data'

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    banners: [],
    cates:[]
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this
    wx.cloud.callFunction({
      name: 'add',
      data: {},
      success: function(res) {
        if (res.result.data != null) {
          that.setData({
            banners: res.result.data
          })
        }
        console.log("banners", res.result)
      },
      fail: console.error
    })
    this.setData({
      cates: bannerdata.cate_data
    })
    console.log("data",this.data.cates)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  // getBanners: function(e) {
  //   const db = wx.cloud.database()
  //   db.collection('banner').where({})
  //     .get()
  //     .then(res => {
  //       this.setData({
  //         banners: res.data,
  //       })
  //     })
  //     .catch(err => {
  //       wx.showToast({
  //         icon: 'none',
  //         title: '查询记录失败'
  //       })
  //       console.error('[数据库] [查询记录] 失败：', err)
  //     })

  // }
})