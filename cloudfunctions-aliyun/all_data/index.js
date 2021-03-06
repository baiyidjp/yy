'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const db = uniCloud.database()
	
	let companyList = await db.collection('company_list').where({
		openid: event.openid
	}).orderBy('createAt', 'desc').get()
	
	let clientList = await db.collection('client_list').where({
		openid: event.openid
	}).orderBy('createAt', 'desc').get()
	
	let channelList = await db.collection('channel_list').where({
		openid: event.openid
	}).orderBy('createAt', 'desc').get()
	
	let issueList = await db.collection('issue_list').where({
		openid: event.openid
	}).orderBy('createAt', 'desc').get()
	
	let rebateInfoList = await db.collection('rebate_date').orderBy('sort', 'asc').get()
	
	let contractStatusList = await db.collection('contract_status').orderBy('sort', 'asc').get()
	
	let invoiceStatusList = await db.collection('invoice_status').orderBy('sort', 'asc').get()
	
	//返回数据给客户端
	return {
		companyList,
		clientList,
		channelList,
		issueList,
		rebateInfoList,
		contractStatusList,
		invoiceStatusList
	}
};
