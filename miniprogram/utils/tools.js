import {MUSIC_LIST} from "./config";
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
// 是否是开发者模式
export const isDevtools = () => {
	const {
			platform
	} = wx.getSystemInfoSync();
	return platform === 'devtools'
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
	music.title = "婚礼歌曲"
	music.epname = "婚礼歌曲"
	music.singer = "李俊峰&王雅倩"
	// music.coverImgUrl = item.picUrl
	music.src = item.src
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
// 显示一个提示框
export const toast = (content) => {
	wx.showToast({
		title: content,
		icon: 'none',
		duration: 2000
	})
}
// 随机返回MUSIC_LIST中的一个
export const getRandomMusic = () => {
	return MUSIC_LIST[Math.floor(Math.random() * MUSIC_LIST.length)]
}

// 计算离2022年5月28日 中午12点 还有多少天，多少小时。多少分。多少秒
export const getTime = () => {
	const date = new Date()
	const now = date.getTime()
	const end = new Date(2022, 4, 28, 12, 0, 0).getTime()
	const leftTime = end - now
	const days = Math.floor(leftTime / (1000 * 60 * 60 * 24))
	const hours = Math.floor((leftTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
	const minutes = Math.floor((leftTime % (1000 * 60 * 60)) / (1000 * 60))
	const seconds = Math.floor((leftTime % (1000 * 60)) / 1000)
	return {
		days,
		hours,
		minutes,
		seconds
	}
}