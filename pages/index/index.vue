<template>
	<view class="wrap">
		<view v-if="!user">
			<u-loading></u-loading>
			<text class="loadTitle">正在检测账号权限</text>
		</view>
		<view v-else-if="!user.approved">
			<text>当前账号没有权限,如已申请,可点击刷新</text>
			<view class="buttons">
				<u-button class="refresh" type="warning" @click="checkAccess">刷新</u-button>
				<u-button type="primary" :disabled="user.name.length > 0" @click="onClickAccess">申请</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: null
			}
		},
		onLoad() {
			this.checkAccess()
		},
		methods: {
			checkAccess () {
				const self = this
				self.user = null;
				// 取出微信的code
				uni.login({
					provider: 'weixin',
					success: loginRes => {
						// 取出当前用户的信息
						uniCloud.callFunction({
							name: 'login',
							data: {
								code: loginRes.code
							}
						}).then(res => {
							self.user = res.result
							if (self.user.approved) {
								// 有权限使用小程序 跳转首页
							}
							// 无权限使用小程序 提示申请
						})
					},
					fail: (error) => {
						console.log(error);
					}
				})
			},
			onClickAccess () {
				uni.navigateTo({
					url: `../access_request/access_request?openid=${this.user.openid}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.loadTitle {
		margin-left: 10px;
	}
	.buttons {
		display: flex;
		justify-content: center;
		margin-top: 10px;
	}
	.buttons .refresh {
		margin-right: 10px;
	}
</style>
