import {
	createDanmu,
	getIp,
	getRandomMusic,
	pauseMusic,
	randomArray,
	setSrc,
	showModal,
	toast,
	touch
} from "../../utils/tools";
var i = 0;

Page({
	data: {
		userData: {
			isBlack: false
		},
		swiperIndex: 0,
		playTime: 0,
		showForm: false,
		snows: [],
		userName: '',
		userNumber: 0,
		userPhone: "",
		userList: ['1人', '2人', '3人', '4人', '5人', '6人'],
		statusBarHeight: '44px',
		animation: [],
		dateTime: "",
		inputData: "",
		danmuList: {
			list: [],
			open: true
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
	async onLoad(option) {
		this.setData({
			userName: option.name,
		})
	},
	async onReady() {
		this.videoContext = wx.createVideoContext('myVideo')
		const {
			result
		} = await wx.cloud.callFunction({
			name: "barrage",
			data: {
				type: "list",
				pageNum: 0
			}
		})
		if (result.data && result.data.length) {
			this.setData({
				['danmuList.list']: result.data
			})
		}
	},
	onShow() {
		this.stopSnow()
		this.initSnow();
		this.setData({
			snows: randomArray(66)
		})
		let userData = wx.getStorageSync('userInfo')
		this.setData({
			userData: userData
		})
		if (userData.userName) {
			this.setData({
				userName: userData.userName,
				userNumber: userData.userNumber - 1,
				userPhone: userData.userPhone,
			})
		}
		// 随机播放音乐
		setSrc({
			src: getRandomMusic()
		})
	},
	onHide() {
		pauseMusic()
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
		touch()
		this.setData({
			swiperIndex: 1
		})
		// 开始播放音乐
	},
	pageChange(e) {
		const {
			current
		} = e.detail
		if (current !== 0) {
			this.stopSnow()
		}
		if (current === 0) {
			this.initSnow();
			this.setData({
				snows: randomArray(66)
			})
		}
		if (current !== 2) {
			this.videoContext.pause()
		}
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
		if (current === 2) {
			this.videoContext.seek(0)
			this.videoContext.play()
		}
		this.setData({
			[`danmuList.open`]: current === 2 ? true : false,
			showForm: current === 4 ? true : false
		})
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
		this.setData({
			inputData: e.detail.value
		})
	},
	// 获取用户信息并且发送弹幕
	async getUserInfo(e) {
		touch()
		const {
			inputData
		} = this.data
		if (!inputData) {
			return showModal('温馨提醒', "你总得说点什么再发送吧")
		}
		if (!e.detail.userInfo) {
			return showModal('温馨提醒', "国家法律规定，不登录的话，不让发弹幕的。")
		}
		// 存储用户信息
		wx.setStorageSync('userInfo', e.detail.userInfo)
		const check = await wx.cloud.callFunction({
			name: "barrage",
			data: {
				type: "check",
				content: inputData
			}
		})
		if (check) {
			let danmu = createDanmu(this.data.playTime, inputData)
			const {
				city,
				province
			} = await getIp()
			danmu.city = city
			danmu.province = province
			await wx.cloud.callFunction({
				name: "barrage",
				data: {
					type: "add",
					item: danmu
				}
			})
			const {
				list
			} = this.data.danmuList
			list.push(danmu)
			this.setData({
				inputData: "",
				['danmuList.list']: list
			})
			toast("祝福成功")
		}
	},
	// 记录播放时间
	updatePlayTime(e) {
		this.setData({
			playTime: +e.detail.currentTime.toFixed(0)
		})
	},
	tabSwitch(e) {
		const {
			value
		} = e.detail
		this.setData({
			[`danmuList.open`]: value
		})
	},
	// 导航到饭店
	navigation(e) {
		touch()
		wx.openLocation({
			latitude: 40.608218,
			longitude: 109.96339,
			scale: 18,
			name: '包头市九原饭店',
			address: '包头市九原饭店'
		})
	},
	// 设置提醒
	setTips(e) {
		touch()
		const {
			type
		} = e.currentTarget.dataset
		if (wx.addPhoneCalendar) {
			const hlList = {
				xy: {
					time: "1653739200",
					title: "婚礼宵夜",
					description: "邀请您参加李俊峰的新婚宵夜酒"
				},
				jq: {
					time: "1653784200",
					title: "婚礼接亲",
					description: "欢迎您参与文明接亲，不闹婚。不婚闹。"
				},
				zx: {
					time: "1653796800",
					title: "婚礼正席提醒",
					description: "李俊峰和王雅倩的婚礼现场，期待您的光临"
				}
			}
			wx.addPhoneCalendar({
				startTime: hlList[type].time,
				endTime: hlList[type].time,
				allDay: true,
				title: hlList[type].title,
				description: hlList[type].description,
				location: "包头市九原饭店(一楼)",
				alarm: true
			})
		} else {
			toast("您的系统不支持这个功能")
		}
	},
	addForm(e) {
		this.setData({
			showForm: !this.data.showForm
		})
	},
	pickerUserNumber(e) {
		this.setData({
			userNumber: e.detail.value
		})
	},
	inputPhoneNumber(e) {
		this.setData({
			userPhone: e.detail.value
		})
	},
	inputName(e) {
		this.setData({
			userName: e.detail.value
		})
	},
	async submitForm() {
		touch()
		let {
			userName,
			userNumber,
			userPhone
		} = this.data
		userNumber = +userNumber + 1
		if (!userName && !userNumber && !userPhone) {
			return toast("没有填写任何信息")
		}
		if (!userName) {
			return toast("没有填写姓名")
		}
		if (!userNumber || userNumber === 0) {
			return toast("没有填写参会人数")
		}
		if (!userPhone) {
			return toast("没有填写手机号")
		}
		if (!/^1[3456789]\d{9}$/.test(userPhone)) {
			return toast("手机号格式不正确")
		}
		wx.showLoading({
			title: '提交中...',
		})
		let userData = wx.getStorageSync('userInfo') || {}
		userData.userName = userName
		userData.userNumber = userNumber
		userData.userPhone = userPhone
		const {
			city,
			province
		} = await getIp()
		userData.city = city
		userData.province = province
		await wx.cloud.callFunction({
			name: "user",
			data: {
				type: "update",
				item: userData
			}
		}).then(res => {
			wx.hideLoading()
			showModal('恭喜', '预约成功')
		})
	}
})