// 云函数入口文件
const cloud = require('wx-server-sdk')
// list : 返回所有弹幕列表
// add ：发送弹幕
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()

	return {
		event,
		openid: wxContext.OPENID,
		appid: wxContext.APPID,
		unionid: wxContext.UNIONID,
	}
}