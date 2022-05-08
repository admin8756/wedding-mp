// 生成指定长度的随机数数组
export const randomArray = (length) => {
    var arr = [];
    for (var i = 0; i < length; i++) {
        arr.push(Math.floor(Math.random() * 1000));
    }
    return arr;
}

//  随机生成一个颜色
export const getRandomColor = () => {
    const rgb = []
    for (let i = 0; i < 3; ++i) {
        let color = Math.floor(Math.random() * 256).toString(16)
        color = color.length === 1 ? '0' + color : color
        rgb.push(color)
    }
    return '#' + rgb.join('')
}

// 输入时间，内容，返回一个弹幕对象
export const createDanmu = (time, content) => {
    const {
        nickName,
        avatarUrl
    } = wx.getStorageSync('userInfo')

    return {
        time,
        content,
        nickName,
        avatarUrl,
        top: Math.ceil(Math.random() * 100),
        color: getRandomColor()
    }
}

// 弹窗
export const showModal = (title, content) => {
    wx.showModal({
        title: title,
        content: content,
        confirmText: "明白了~",
        showCancel: false
    })
}