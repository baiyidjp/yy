'use strict';
exports.main = async (event, context) => {
	// event.type = get/add/update/delete
	// get 获取渠道的列表
	// add 增加新的渠道
	// update 更新渠道信息
	// delete 删除渠道
	const type = event.type
	
	const db = uniCloud.database()
	
	if (type === 'get') {
		let channelList = await db.collection('channel_list').where({
			openid: event.openid
		}).orderBy('createAt', 'desc').get()
		return channelList
	}
	
	if (type === 'add') {
		
		const channelid = await db.collection('channel_list').add(event.channel)
		return channelid
	}
	
	if (type === 'update') {
		const channel = event.channel
		const result = await db.collection('channel_list').doc(channel._id).update({
			channelName: channel.channelName,
			quotationPoint: channel.quotationPoint,
			channelCompany: channel.channelCompany,
			mark: channel.mark,
			createAt: channel.createAt,
			createBy: channel.createBy,
			updateAt: channel.updateAt,
			updateBy: channel.updateBy
		})
		return result ? true : false
	}
	
	if (type === 'delete') {
		const channel = event.channel
		const result = await db.collection('channel_list').where({
			openid: channel.openid,
			_id: channel._id
		}).remove()
		return result ? true : false
	}
	
	//返回数据给客户端
	return event
};
