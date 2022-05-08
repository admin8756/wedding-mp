import {
    randomArray
} from "../../utils/tools";

var i = 0;
Page({
    data: {
        swiperIndex: 0,
        snows: [],
        animation: [],
        dateTime: "",
        textList: [
            `<p class="moreText">送呈贵宾 恭请阁下莅临</p>`,
            `<p class="moreText">谨定于二零二二年五月二十九日</p>`,
            `<p class="moreText">为新郎 <strong>李俊峰</strong>  新娘 <strong>王雅倩 </strong></p>`,
            `<p class="moreText">举办婚典喜宴 敬备喜筵</p>`,
            `<p class="moreText">席设 · 包头市九原饭店<br></p>`,
            `<p class="author">特邀<strong>·恭候光临</strong></p>`,
        ]
    },
    onLoad(options) {},
    onReady() {},
    onShow() {
        this.stopSnow()
        this.initSnow();
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
        console.log(e)
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
    }
})