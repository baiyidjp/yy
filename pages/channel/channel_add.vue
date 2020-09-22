<template>
	<view class="wrap">
		<u-form class="form-wrap" :model="channel" ref="channelForm" label-width="200" label-position="top">
			<u-form-item label="请输入渠道名称:" prop="channelName">
				<u-input v-model="channel.channelName" placeholder="请输入渠道名称" />
			</u-form-item>
			<u-form-item label="请输入报价点数(小数):" prop="quotationPoint">
				<u-input type="number" v-model="channel.quotationPoint" placeholder="请输入报价点数(小数)" />
			</u-form-item>
			<u-form-item label="请输入渠道所属公司:" prop="channelCompany">
				<u-input v-model="channel.channelCompany" placeholder="请输入渠道所属公司" />
			</u-form-item>
			<u-form-item label="备注:">
				<u-input v-model="channel.mark" placeholder="请输入备注(选填)" />
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
				channel: {
					channelName: '',
					quotationPoint: '',
					channelCompany: '',
					mark: '',
					openid: ''
				},
				index: null,
				isEdit: false,
				rules: {
					channelName: [{
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
					channelchannel: [{
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
				this.channel = this.channelList[option.index]
				this.isEdit = true
			}
		},
		onReady() {
			this.$refs.channelForm.setRules(this.rules);
			if (this.isEdit) {
				uni.setNavigationBarTitle({
					title: '编辑渠道'
				})
			}
		},
		computed: {
			...mapGetters(['openid', 'channelList'])
		},
		methods: {
			...mapMutations(['ADDCHANNEL', 'UPDATECHANNEL']),
			onClickSubmit() {
				const self = this
				self.submiting = true
				self.channel.openid = self.openid
				this.$refs.channelForm.validate(valid => {
					if (valid) {
						if (self.isEdit) {
							uniCloud.callFunction({
								name: 'channel',
								data: {
									type: 'update',
									channel: self.channel
								}
							}).then(res => {
								if (res.result) {
									self.showToast()
								}
							})
						} else {
							uniCloud.callFunction({
								name: 'channel',
								data: {
									type: 'add',
									channel: self.channel
								}
							}).then(res => {
								if (res.result.id) {
									self.channel._id = res.result.id
									self.ADDCHANNEL({
										channel: self.channel
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
