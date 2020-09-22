<template>
	<view class="wrap">
		<u-form class="form-wrap" :model="client" ref="clientForm" label-width="200" label-position="top">
			<u-form-item label="请输入渠道名称:" prop="clientName">
				<u-input v-model="client.clientName" placeholder="请输入渠道名称" />
			</u-form-item>
			<u-form-item label="请输入报价点数(小数):" prop="quotationPoint">
				<u-input type="number" v-model="client.quotationPoint" placeholder="请输入报价点数(小数)" />
			</u-form-item>
			<u-form-item label="请输入渠道所属公司:" prop="clientCompany">
				<u-input v-model="client.clientCompany" placeholder="请输入渠道所属公司" />
			</u-form-item>
			<u-form-item label="备注:">
				<u-input v-model="client.mark" placeholder="请输入备注(选填)" />
			</u-form-item>
		</u-form>
		<u-button class="submitButton" :loading="submiting" :disabled="submiting" @click="onClickSubmit" type="primary">提交</u-button>
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
				client: {
					clientName: '',
					quotationPoint: '',
					clientCompany: '',
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
					clientName: [{
						required: true,
						message: '请输入渠道名称',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					quotationPoint: [{
						required: true,
						message: '请输入报价点数(小数)',
						trigger: ['change', 'blur']
					}],
					clientclient: [{
						required: true,
						message: '请输入渠道所属公司',
						trigger: ['change', 'blur']
					}]
				},
				submiting: false
			}
		},
		onLoad(option) {
			if (option.index) {
				this.index = option.index
				this.client = this.clientList[option.index]
				this.isEdit = true
			}
		},
		onReady() {
			this.$refs.clientForm.setRules(this.rules);
			if (this.isEdit) {
				uni.setNavigationBarTitle({
					title: '编辑渠道'
				})
			}
		},
		computed: {
			...mapGetters(['openid', 'clientList'])
		},
		methods: {
			...mapMutations(['ADDCLIENT', 'UPDATECLIENT']),
			onClickSubmit() {
				const self = this
				self.submiting = true
				self.client.openid = self.openid
				this.$refs.clientForm.validate(valid => {
					if (valid) {
						if (self.isEdit) {
							self.client.updateAt = Date.now()
							self.client.updateBy = self.client.openid
							uniCloud.callFunction({
								name: 'client',
								data: {
									type: 'update',
									client: self.client
								}
							}).then(res => {
								if (res.result) {
									self.showToast()
								}
							})
						} else {
							self.client.createAt = Date.now()
							self.client.createBy = self.client.openid
							uniCloud.callFunction({
								name: 'client',
								data: {
									type: 'add',
									client: self.client
								}
							}).then(res => {
								if (res.result.id) {
									self.client._id = res.result.id
									self.ADDCLIENT({
										client: self.client
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
		padding: 20px 20px;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.submitButton {
		margin-top: 20px;
	}
</style>
