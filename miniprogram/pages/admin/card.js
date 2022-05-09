Page({
	data: {
    list:[],
    userName:""
	},
	onLoad(options) {},
	onReady() {},
	onShow() {
	},
	onHide() {},
	onUnload() {},
	onPullDownRefresh() {},
	onReachBottom() {},
  onShareAppMessage() {},
  // 新增卡片
  addCard() {
    wx.cloud.callFunction({
      name: 'barrage',
      data: {
        type:"list"
      }
    }).then(res => {
      console.log(res)
      this.setData({
        userName:""
      })
    }).catch(err => {
      console.log(err)
    })
  },
  // 输入姓名
  inputName(e) {
    this.setData({
      userName:e.detail.value
    })
  },
  // 删除卡片
  delCard(e) {
    let index = e.currentTarget.dataset.index
    let list = this.data.list
    list.splice(index, 1)
    this.setData({
      list:this.getList()
    })
  },
  // 获取列表
  getList() {
    wx.cloud.callFunction({
      name: 'barrage',
      data: {
        type:"list"
      }
    }).then(res => {
      console.log(res)
      this.setData({
        list: res.result.data
      })
    }).catch(err => {
      console.log(err)
    })
   }
})