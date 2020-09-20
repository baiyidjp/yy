<template>
	<view class="wrap">
		<u-form class="form-wrap" :model="company" ref="companyForm" label-width="200" label-position="top">
			<u-form-item label="税源地名称:" prop="companyName">
				<u-input type="number" v-model="company.companyName" placeholder="请输入税源地名称" />
			</u-form-item>
			<u-form-item label="税源地服务费(小数):" prop="serviceCharge">
				<u-input type="number" v-model="company.serviceCharge" placeholder="请输入税源地服务费(小数)" />
			</u-form-item>
			<u-form-item label="税源地小额服务费(小数):" prop="serviceChargeSmall">
				<u-input type="number" v-model="company.serviceChargeSmall" placeholder="请输入税源地小额服务费(小数)" />
			</u-form-item>
			<u-form-item label="税源地个税(小数):" prop="tax">
				<u-input type="number" v-model="company.tax" placeholder="请输入税源地个税(小数)" />
			</u-form-item>
		</u-form>
		<u-button class="submitButton" @click="onClickSubmit" type="primary">提交</u-button>
		<u-toast ref="uToast"/>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				company: {
					companyName: '',
					serviceCharge: 0,
					serviceChargeSmall: 0,
					tax: 0,
					openid: ''
				},
				rules: {
					companyName: [{
						required: true,
						message: '请输入税源地名称',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					serviceCharge: [{
						required: true,
						message: '请输入税源地服务费(小数)',
						trigger: ['change', 'blur']
					}],
					serviceChargeSmall: [{
						required: true,
						message: '请输入税源地小额服务费(小数)',
						trigger: ['change', 'blur']
					}],
					tax: [{
						required: true,
						message: '请输入税源地个税(小数)',
						trigger: ['change', 'blur']
					}],
				}
			}
		},
		onReady() {
			this.$refs.companyForm.setRules(this.rules);
		},
		computed: {
			...mapGetters(['openid'])
		},
		methods: {
			...mapMutations(['ADDCOMPANY']),
			onClickSubmit() {
				const self = this
				self.company.openid = self.openid
				this.$refs.companyForm.validate(valid => {
					if (valid) {
						uniCloud.callFunction({
							name: 'company_list',
							data: {
								type: 'add',
								company: self.company
							}
						}).then(res => {
							if (res.result) {
								self.ADDCOMPANY({
									company: self.company
								})
								self.$refs.uToast.show({
									title: '添加成功',
									type: 'success'
								})
								setTimeout(() => {
									uni.navigateBack()
								}, 1000)
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
		padding: 20px 20px;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.submitButton {
		margin-top: 20px;
	}
</style>
