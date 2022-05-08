import {
    createDanmu,
    randomArray,
    showModal
} from "../../utils/tools";
var i = 0;

Page({
    data: {
        swiperIndex: 0,
        playTime: 0,
        snows: [],
        statusBarHeight: '44px',
        animation: [],
        dateTime: "",
        inputData: "",
        danmuList: {
            list: [],
            open: true,
        },
        textList: [
            `<p class="moreText">送呈贵宾 恭请阁下莅临</p>`,
            `<p class="moreText">谨定于二零二二年五月二十九日</p>`,
            `<p class="moreText">为新郎 <strong>李俊峰</strong>  新娘 <strong>王雅倩 </strong></p>`,
            `<p class="moreText">举办婚典喜宴 敬备喜筵</p>`,
            `<p class="moreText">席设 · 包头市九原饭店<br></p>`,
            `<p class="author">特邀<strong>·恭候光临</strong></p>`,
        ]
    },
    onLoad() {
        this.setData({
            [`danmuList.list`]: []
        })
    },
    onReady() {
        this.videoContext = wx.createVideoContext('myVideo')
    },
    AddNewDanmu(danmu) {
        this.id = wx.getStorageSync('user_openId');
        this.danmu = danmu;
        this.display = false;
        this.top = Math.ceil(Math.random() * 100);
        this.time = 10;
        this.color = com.getColor();
        this.avatarUrl = wx.getStorageSync('user_avatarUrl');
    },
    onShow() {
        this.stopSnow()
        this.initSnow();
        wx.getSystemInfoSync({
            success: (result) => {
                const {
                    windowHeight,
                    safeArea
                } = result
                console.log(result)
                this.setData({
                    statusBarHeight: windowHeight - safeArea.height
                })
            },
        })
        this.setData({
            snows: randomArray(66)
        })
    },
    onHide() {
        this.stopSnow()
    },
    onUnload() {
        this.stopSnow()
    },
    onPullDownRefresh() {},
    onReachBottom() {},
    onShareAppMessage() {},
    // 开启喜帖
    nextPage() {
        this.setData({
            swiperIndex: this.data.swiperIndex + 1
        })
        // 开始播放音乐
    },
    pageChange(e) {
        const {
            current
        } = e.detail
        if (current === 1) {
            for (let i = 0; i < this.data.textList.length; i++) {
                const aniData = wx.createAnimation({
                    duration: 1000,
                    timingFunction: 'ease-out',
                    delay: 800 * (i + 1),
                })
                aniData.opacity(1).step()
                this.setData({
                    [`ani.${i}`]: aniData.export()
                })
            }
        } else if (current === 2) {
            this.videoContext.seek(0)
            this.videoContext.play()
        }
    },
    // 初始化下雪
    initSnow() {
        setTimeout(function () {
            let animation = wx.createAnimation({})
            animation.translateY(804).opacity(1).step({
                duration: 5000
            })
            animation.translateY(0).opacity(1).step({
                duration: 0
            })
            this.setData({
                ['snows[' + i + ']']: Math.floor(Math.random() * 1000),
                ['animation[' + i + ']']: animation.export()
            })
            i++;
            if (i == 50)
                i = 0
        }.bind(this), 500)
        var dateTime = setTimeout(function () {
            this.initSnow()
        }.bind(this), 100)
        this.setData({
            dateTime,
        })
    },
    // 停止下雪
    stopSnow() {
        clearTimeout(this.data.dateTime)
        this.setData({
            snows: [],
            animation: []
        })
    },
    // 绑定弹幕的输入
    inputDanMu(e) {
        this.inputData = e.detail.value
    },
    // 获取用户信息并且发送弹幕
    getUserInfo(e) {
        if (!this.inputData) {
            return showModal('温馨提醒', "你总得说点什么再发送吧")
        }
        if (!e.detail.userInfo) {
            return showModal('温馨提醒', "国家法律规定，不登录的话，不让发弹幕的。")
        }
        // 存储用户信息
        wx.setStorageSync('userInfo', e.detail.userInfo)
        // 检查内容
        const danmu = createDanmu(this.data.playTime, this.inputData)
        const {
            list
        } = this.data.danmuList
        list.push(danmu)
        this.setData({
            inputData: "",
            [`danmuList.list`]: list
        })
    },
    // 记录播放时间
    updatePlayTime(e) {
        this.setData({
            playTime: e.detail.currentTime
        })
    },
    tabSwitch(e) {
        this.setData({
            [`danmuList.open`]: e.detail.value
        })
    }
})