App({
    onLaunch: function (e) {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力');
        } else {
            wx.cloud.init({
                // env: 'my-env-id',
                traceUser: true,
            });
        }
        wx.cloud.callFunction({
            name: "user",
            data: {
                type: "initUser"
            }
        }).then(res => {
            wx.setStorageSync('userInfo', res.result.data[0])
        })
    },
    onShow() {
        wx.cloud.callFunction({
            name: "user",
            data: {
                type: "get"
            }
        }).then(res => {
            wx.setStorageSync('userInfo', res.result.data[0])
        })
    },
    update() {
        const updateManager = wx.getUpdateManager()
        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                    if (res.confirm) {
                        updateManager.applyUpdate()
                    }
                }
            })
        })
        updateManager.onUpdateFailed(function () {
            wx.showLoading({
                title: '新版本下载失败，请重启!',
            })
        })
    },
    onError(msg) {
        wx.showModal({
            title: '小程序发生未知错误',
            content: msg,
            confirmText: '重启一下',
            confirmColor: '#000',
            success: function (res) {
                if (res.confirm) {
                    wx.reLaunch({
                        url: '/pages/index/index'
                    })
                }
            }
        })
    },
});