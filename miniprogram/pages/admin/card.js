const {
    toast
} = require("../../utils/tools")

Page({
    data: {
        list: [],
        userName: "",
        pageNum: 0,
        imgDraw: {}
    },
    onLoad(options) {
        this.getList()
    },
    onReady() {},
    onShow() {},
    onHide() {},
    onUnload() {},
    onPullDownRefresh() {},
    onReachBottom() {
        this.setData({
            pageNum: this.data.pageNum + 1
        })
        this.getList()
    },
    onShareAppMessage() {},
    // 新增卡片
    async addCard() {
        const name = this.data.userName
        if (!name) {
            toast("名字不能为空")
        } else {
            wx.showLoading({
                title: '生成中'
            })
            // 获取二维码
            let ercode = await wx.cloud.callFunction({
                name: "card",
                data: {
                    type: "ercode",
                    name: name
                }
            })
            const res = await wx.cloud.downloadFile({
                fileID: ercode.result
            })
            this.setData({
                imgDraw: {
                    "width": "720px",
                    "height": "1280px",
                    "background": "#f8f8f8",
                    "views": [{
                            "type": "image",
                            "url": "../../images/backgroundCard.jpeg",
                            "css": {
                                "width": "720px",
                                "height": "1280px",
                                "top": "0px",
                                "left": "0px",
                                "rotate": "0",
                                "borderRadius": "",
                                "borderWidth": "",
                                "borderColor": "#000000",
                                "shadow": "",
                                "mode": "scaleToFill"
                            }
                        },
                        {
                            "type": "image",
                            "url": res.tempFilePath,
                            "css": {
                                "width": "300px",
                                "height": "300px",
                                "top": "270px",
                                "left": "210px",
                                "rotate": "0",
                                "borderRadius": "50%",
                                "borderWidth": "",
                                "borderColor": "#000000",
                                "shadow": "",
                                "mode": "scaleToFill"
                            }
                        },
                        {
                            "type": "text",
                            "text": `${name}亲启`,
                            "css": {
                                "color": "#000000",
                                "background": "rgba(0,0,0,0)",
                                "width": "720px",
                                "height": "42.89999999999999px",
                                "top": "1100px",
                                "left": "0px",
                                "rotate": "0",
                                "borderRadius": "",
                                "borderWidth": "",
                                "borderColor": "#000000",
                                "shadow": "3 3 5 #888888",
                                "padding": "0px",
                                "fontSize": "30px",
                                "fontWeight": "normal",
                                "maxLines": "2",
                                "lineHeight": "43.290000000000006px",
                                "textStyle": "fill",
                                "textDecoration": "none",
                                "fontFamily": "",
                                "textAlign": "center"
                            }
                        }
                    ]
                }
            })
        }
    },
    // 输入姓名
    inputName(e) {
        this.setData({
            userName: e.detail.value
        })
    },
    // 图片生成完毕
    async onImgOK(e) {
        wx.hideLoading()
        this.setData({
            sharePath: e.detail.path,
        })
        const file = await wx.cloud.uploadFile({
            cloudPath: `card/${this.data.userName}.png`,
            filePath: e.detail.path
        })
        const item = {
            name: this.data.userName,
            url: file.fileID
        }
        wx.cloud.callFunction({
            name: 'card',
            data: {
                type: "add",
                item
            }
        }).then(res => {
            console.log(res)
            toast("上传成功")
            this.setData({
                userName: "",
                list: [],
                pageNum: 0
            })
            this.getList()
        }).catch(err => {
            console.log(err)
        })
    },
    onImgErr(e) {
        console.log(e)
        wx.hideLoading()
    },
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
            name: 'card',
            data: {
                type: "list",
                pageNum: this.data.pageNum
            }
        })
        this.setData({
            list: this.data.list.concat(res.result.data)
        })
    },
    // 预览图片
    async previewImage(e) {
        const {
            url
        } = e.currentTarget.dataset
        wx.previewImage({
            urls: [url]
        })
    },
})