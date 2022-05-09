// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database().collection('card')
// 生成二维码
const getQrCode = async (userName) => {
	const fileName = 'qrcode/' + userName + '.png';
	const result = await cloud.openapi.wxacode.get({
		"path": `pages/index/index?name=${userName}`,
		"width": 430,
		"envVersion": 'develop'
		// "envVersion": 'release' // 线上环境
	})
	if (result && result.buffer) {
		var res = await cloud.uploadFile({
			cloudPath: fileName,
			fileContent: result.buffer,
		})
		return res.fileID || false
	} else {
		return result
	}
}

// 获取邀请函列表(传入页码)
const getList = (pageNum) => {
	const MAX_LIMIT = 100
	return db.skip(pageNum * MAX_LIMIT).limit(MAX_LIMIT).get()
}

// 删除邀请函（传入id）
const delOne = async (_id) => {
	return await db.doc(_id).remove()
}
// 新增邀请函（传入邀请卡对象）
const addOne = async (item) => {
	const old = db.where({
		name: item.name
	}).get()
	if (old.data && old.data.length > 0) {
		return '邀请对象已存在，如需修改请先删除'
	} else {
		return await db.add({data:item})
	}
}
// 云函数入口函数
exports.main = async (event, context) => {
	if (!event.type) {
		return '缺少必要参数：type'
	}
	if (event.type === 'ercode') {
		return await getQrCode(event.name)
	}
	if (event.type === 'list') {
		return getList(event.pageNum)
	}
	if (event.type === 'del') {
		return delOne(event.id)
	}
	if (event.type === 'add') {
		return addOne(event.item)
	}
	return '方法调用错误，没有找到对应的type'
}