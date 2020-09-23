<template>
	<view class="wrap">
		<u-form class="form-wrap" :model="company" ref="companyForm" label-width="200" label-position="top">
			<u-form-item label="税源地名称:" prop="companyName">
				<u-input v-model="company.companyName" placeholder="请输入税源地名称" />
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
			<u-form-item label="备注:">
				<u-input v-model="company.mark" type="textarea" :auto-height="true" height="44" placeholder="请输入备注(选填)" />
			</u-form-item>
		</u-form>
		<u-button class="submit-button" :loading="submiting" :disabled="submiting" @click="onClickSubmit" type="primary">提交</u-button>
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
					serviceCharge: '',
					serviceChargeSmall: '',
					tax: '0.015',
					mark: '',
					openid: '',
					createAt: null,
					createBy: null,
					updateAt: null,
					updateBy: null
				},
				index: null,
				isEdit: false,
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
				},
				submiting: false
			}
		},
		onLoad(option) {
			if (option.index) {
				this.index = option.index
				this.company = this.companyList[option.index]
				this.isEdit = true
			}
		},
		onReady() {
			this.$refs.companyForm.setRules(this.rules);
			if (this.isEdit) {
				uni.setNavigationBarTitle({
					title: '编辑税源地'
				})
			}
		},
		computed: {
			...mapGetters(['currentUser', 'companyList'])
		},
		methods: {
			...mapMutations(['ADDCOMPANY', 'UPDATECOMPANY']),
			onClickSubmit() {
				const self = this
				self.submiting = true
				self.company.openid = self.currentUser.openid
				this.$refs.companyForm.validate(valid => {
					if (valid) {
						if (self.isEdit) {
							self.company.updateAt = Date.now()
							self.company.updateBy = self.company.openid
							uniCloud.callFunction({
								name: 'company',
								data: {
									type: 'update',
									company: self.company
								}
							}).then(res => {
								if (res.result) {
									self.showToast()
								}
							})
						} else {
							self.company.createAt = Date.now()
							self.company.createBy = self.company.openid
							console.log(self.company);
							uniCloud.callFunction({
								name: 'company',
								data: {
									type: 'add',
									company: self.company
								}
							}).then(res => {
								if (res.result.id) {
									self.company._id = res.result.id
									self.ADDCOMPANY({
										company: self.company
									})
									self.showToast()
								}
							})
						}
					} else {
						self.submiting = false
						console.log('验证失败');
					}
				});
			},
			showToast() {
				this.$refs.uToast.show({
					title: this.isEdit ? '更新成功' : '添加成功',
					type: 'success'
				})
				setTimeout(() => {
					this.submiting = false
					uni.navigateBack()
				}, 500)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		padding: 20px 20px 34px;
		display: flex;
		flex-direction: column;
	}

	.submit-button {
		margin-top: 20px;
	}
</style>
