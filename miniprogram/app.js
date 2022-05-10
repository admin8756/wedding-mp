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
    }
});