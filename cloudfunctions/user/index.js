// 云函数入口文件
const cloud = require('wx-server-sdk')
// 用户相关
// list:获取所有用户（页码模式）
// count：返回所有用户的预约数（）
// userData :返回当前用户的信息（预约信息）如果没有找到，则新建

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