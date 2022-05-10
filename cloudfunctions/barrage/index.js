// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database().collection('barrage')

// 获取邀请函列表(传入页码)
const getList = (pageNum) => {
    const MAX_LIMIT = 100
    return db.skip(pageNum * MAX_LIMIT).limit(MAX_LIMIT).get()
}
// 删除邀请函（传入id）
const delOne = async (_id) => {
    return await db.doc(_id).remove()
}
// 检查内容
const checkContent = async (content) => {
    try {
        const result = await cloud.openapi.security.msgSecCheck({
            "openid": cloud.getWXContext().OPENID,
            "scene": 2,
            "version": 2,
            "content": content
        })
        return {
            text: content,
            code: result.errCode === 0
        }
    } catch (err) {
        return {
            err,
            content
        }
    }
}
// 新增弹幕：发送弹幕（内容审核）
const addOne = async (item) => {
    item.show = false
    return await db.add({
        data: item
    })
}
const countNum = async() => {
    return db.count()
}
// 云函数入口函数
exports.main = async (event, context) => {
    if (!event.type) {
        return '缺少必要参数：type'
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
    if (event.type === 'check') {
        return checkContent(event.text)
    }
    if(event.type==='count'){
        return countNum()
    }
    return '方法调用错误，没有找到对应的type'
}