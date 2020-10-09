'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const db = uniCloud.database()
	
	let companyList = await db.collection('company_list').where({
		openid: event.openid
	}).get()
	
	let clientList = await db.collection('client_list').where({
		openid: event.openid
	}).get()
	
	let channelList = await db.collection('channel_list').where({
		openid: event.openid
	}).get()
	
	let issueList = await db.collection('issue_list').where({
		openid: event.openid
	}).get()
	
	//返回数据给客户端
	return {
		companyList,
		clientList,
		channelList,
		issueList
	}
};
