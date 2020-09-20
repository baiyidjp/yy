'use strict';
exports.main = async (event, context) => {
	
	const db = uniCloud.database()
	
	const userid = await db.collection('user_list').add(event.user)
	
	//返回数据给客户端
	return userid ? true : false
};
