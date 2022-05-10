Page({
	data: {
        list:[],
        pageNum:0
    },
	onLoad(options) {
        this.getList()
    },
	onReady() {},
	onShow() {},
	onHide() {},
	onUnload() {},
	onPullDownRefresh() {},
	onReachBottom() {},
    onShareAppMessage() {},
    // 删除卡片
    async delCard(e) {
        let {
            id,
            name
        } = e.currentTarget.dataset
        wx.showModal({
            title: '温馨提醒',
            content: `删除无法恢复，您现在正要删除的是《${name}》，确定吗？`,
            success: async (res) => {
                if (res.confirm) {
                    const res = await wx.cloud.callFunction({
                        name: 'card',
                        data: {
                            type: "del",
                            id: id
                        }
                    })
                    if (res.result.stats.removed === 1) {
                        toast("删除成功")
                        this.setData({
                            pageNum: 0,
                            list: []
                        })
                        this.getList()
                    } else {
                        toast("删除失败")
                    }

                }
            }
        })
    },
    // 获取列表
    async getList() {
        const res = await wx.cloud.callFunction({
            name: 'barrage',
            data: {
                type: "list",
                pageNum: this.data.pageNum
            }
        })
        console.log(res)
        this.setData({
            list: this.data.list.concat(res.result.data)
        })
    },
    // 更新信息
    async updateCard(){

    }
})