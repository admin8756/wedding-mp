// 云函数入口文件
const cloud = require('wx-server-sdk')
// 用户相关
// list:获取所有用户（页码模式）
// count：返回所有用户的预约数（）
// get :返回当前用户的信息（预约信息）如果没有找到，则新建
// add: 有用户信息则更新，没有则新建
cloud.init()
const db = cloud.database().collection('users')
const $ = cloud.database().command.aggregate
const getList = async (pageNum) => {
    const MAX_LIMIT = 100
    return db.skip(pageNum * MAX_LIMIT).limit(MAX_LIMIT).get()
}
const getOne = async () => {
    return db.where({
        user_id: cloud.getWXContext().OPENID
    }).get()
}
const initUser = async () => {
    let user = await getOne()
    if (!user.data.length) {
        await db.add({
            data: {
                user_id: cloud.getWXContext().OPENID,
                isBlack: false,
                creationTime: new Date(),
            }
        })
        return await getOne()
    } else {
        return await getOne()
    }
}

const addOne = async (item) => {
    let user = await getOne()
    if (user.data[0].name) {
        return updateOne(item)
    } else {
        return db.add({
            data: item
        })
    }
}
const updateOne = async (item) => {
    const id = item._id
    delete item._id
    item.updateTime = new Date()
    return db.doc(id).update({
        data: item
    })
}
// 统计所有用户的userNumber
const count = async () => {
    return db.aggregate()
        .group({
            _id: null,
            count: $.sum('$userNumber')
        })
        .end()
}


// 云函数入口函数
exports.main = async (event, context) => {
    if (!event.type) {
        return '缺少必要参数：type'
    }
    if (event.type === 'list') {
        return getList(event.pageNum)
    }
    if (event.type === 'get') {
        return getOne(event.id)
    }
    if (event.type === 'add') {
        return addOne(event.item)
    }
    if (event.type === 'update') {
        return updateOne(event.item)
    }
    if (event.type == "initUser") {
        return initUser(event.item)
    }
    if (event.type === 'count') {
        return count()
    }
    return '方法调用错误，没有找到对应的type'
}