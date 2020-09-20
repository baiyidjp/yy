<template>
	<view class="wrap">
		<u-form class="form-wrap" :model="user" ref="userForm" label-width="150">
			<u-form-item label="姓名:" prop="name">
				<u-input v-model="user.name" placeholder="请输入姓名" />
			</u-form-item>
			<u-form-item label="联系方式:" prop="phone">
				<u-input v-model="user.phone" placeholder="请输入联系方式" />
			</u-form-item>
		</u-form>
		<u-button class="submitButton" @click="onClickSubmit" type="primary">提交</u-button>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: {
					openid: '',
					name: '',
					phone: '',
					approved: false
				},
				rules: {
					name: [{
						required: true,
						message: '请输入姓名',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					phone: [{
						required: true,
						message: '请输入联系方式',
						trigger: ['change', 'blur']
					}]
				}
			}
		},
		onLoad(option) {
			this.user.openid = option.openid
		},
		onReady() {
			this.$refs.userForm.setRules(this.rules);
		},
		methods: {
			onClickSubmit() {
				const self = this
				this.$refs.userForm.validate(valid => {
					if (valid) {
						uniCloud.callFunction({
							name: 'user_create',
							data: {
								user: self.user
							}
						}).then(res => {
							if (res.result) {
								self.$refs.uToast.show({
									title: '申请成功',
									type: 'success'
								})
								setTimeout(() => {
									uni.navigateBack()
								},1000)
							}
						})
					} else {
						console.log('验证失败');
					}
				});
			}
		},
	}
</script>

<style lang="scss" scoped>
	.wrap {
		padding: 0 20px;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.submitButton {
		margin-top: 20px;
	}
</style>
