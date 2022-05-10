const {
    getTime
} = require("../../utils/tools");

/**
 * 管理后台
 *  */
Page({
    data: {
        time: getTime(),
    },
    onLoad(options) {},
    onReady() {},
    onShow() {
        // 设置一个定时器，每秒请求一次
        this.timer = setInterval(() => {
            this.setData({
                time: getTime()
            })
        }, 1000);
        // 统计人数
        wx.cloud.callFunction({
            name: "user",
            data: {
                type: "count"
            }
        }).then(res=>{
            this.setData({
                num:res.result.list[0].count
            })
        })
    },
    onHide() {
        // 取消定时器
        clearInterval(this.timer);
    },
    onUnload() {},
    onPullDownRefresh() {},
    onReachBottom() {},
    onShareAppMessage() {}
})