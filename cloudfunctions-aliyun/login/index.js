'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const code = event.code
	if (!code) {
		return false
	}
	
	const db = uniCloud.database()
	
	const authUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=wx39bdc15715f29e38&secret=92adab0b74194c5b55f6847c909381c6&js_code=${code}&grant_type=authorization_code`
	
	const authResult = await uniCloud.httpclient.request(authUrl, {
		method:'GET',
		dataType: 'json'
	})
	const openid = authResult.data.openid

	const authList = await db.collection('auth_list').where({
		openid: openid
	})
	
	// const authOpenids = authList.map(item => {
	// 	return item.openid
	// })
		
	// console.log(authResult, authOpenids);
	
	return authList ? true : false
	
};
