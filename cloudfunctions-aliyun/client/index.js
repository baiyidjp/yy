'use strict';
exports.main = async (event, context) => {
	// event.type = get/add/update/delete
	// get 获取客户的列表
	// add 增加新的客户
	// update 更新客户信息
	// delete 删除客户
	const type = event.type
	
	const db = uniCloud.database()
	
	if (type === 'get') {
		let clientList = await db.collection('client_list').where({
			openid: event.openid
		}).get()
		return clientList
	}
	
	if (type === 'add') {
		
		const clientid = await db.collection('client_list').add(event.client)
		return clientid
	}
	
	if (type === 'update') {
		const client = event.client
		const result = await db.collection('client_list').doc(client._id).update({
			clientName: client.clientName,
			quotationPoint: client.quotationPoint,
			clientCompany: client.clientCompany,
			mark: client.mark,
			createAt: client.createAt,
			createBy: company.createBy,
			updateAt: company.updateAt,
			updateBy: company.updateBy
		})
		return result ? true : false
	}
	
	if (type === 'delete') {
		const client = event.client
		const result = await db.collection('client_list').where({
			openid: client.openid,
			_id: client._id
		}).remove()
		return result ? true : false
	}
	
	//返回数据给客户端
	return event
};