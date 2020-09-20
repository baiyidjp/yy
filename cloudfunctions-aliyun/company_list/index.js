'use strict';
exports.main = async (event, context) => {
	// event.type = get/add
	// get 获取税源地的列表
	// add 增加新的税源地
	const type = event.type
	
	const db = uniCloud.database()
	
	if (type === 'get') {
		let companyList = await db.collection('company_list').where({
			openid: event.openid
		}).get()
		return companyList
	}
	
	if (type === 'add') {
		
		const companyid = await db.collection('company_list').add(event.company)
		return companyid ? true : false
	}
	
	//返回数据给客户端
	return event
};
