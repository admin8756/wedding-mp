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

// 播放音乐相关内容
const music = wx.getBackgroundAudioManager()
export const setSrc = (item) => {
	music.title = item.name
	music.epname = item.name
	music.singer = item.auther
	music.coverImgUrl = item.picUrl
	music.src = item.mp3url
	music.onEnded(() => {
		setSrc(item);
	})
}
export const pauseMusic = () => {
	music.stop()
}


//  发出震动
export const touch = (type = "medium") => {
	// type：heavy、medium、light
	if (isDevtools()) {
		return
	}
	wx.vibrateShort({
		type
	})
}

// 登录

export const wxLogin = () => {
	if (isDevtools()) {
		return
	} else {
		const {
			batteryLevel,
			language,
			platform,
			model,
			brand,
			version,
			benchmarkLevel
		} = wx.getSystemInfoSync()
		let log = {
			batteryLevel,
			language,
			platform,
			model,
			brand,
			version,
			benchmarkLevel
		}
		log.time = new Date()
		wx.request({
			url: 'https://pv.sohu.com/cityjson?ie=utf-8',
			success: res => {
				log.ipData = JSON.parse(res.data.match(/.*(\{[^\}]+\}).*/)[1] || '{}')
				wx.cloud.callFunction({
					name: 'user',
					data: {
						type: "add"
					}
				})
			}
		})
	}
}
// 显示一个提示框
export const toast = (content) => {
	wx.showToast({
		title: content,
		icon: 'none',
		duration: 2000
	})
}
// 返回