<template>
	<view class="wrap">
		<u-form class="form-wrap" :model="client" ref="clientForm" label-width="200" label-position="top">
			<u-form-item label="客户名称:" prop="clientName">
				<u-input v-model="client.clientName" placeholder="请输入客户名称" />
			</u-form-item>
			<u-form-item label="服务费费率(小数):" prop="signupPoint">
				<u-input type="number" v-model="client.signupPoint" placeholder="请输入服务费费率(小数)" />
			</u-form-item>
			<u-form-item label="签约时间:" prop="signupTime">
				<u-input v-model="client.signupTime" type="select" placeholder="请选择签约时间" @click="showCalendar = true" />
			</u-form-item>
			<u-form-item label="税源地(多选):">
				<u-input v-model="clientCompanyNames" type="select" placeholder="请选择税源地" @click="showCompanyPop = true" />
			</u-form-item>
			<u-form-item label="渠道:" prop="channel">
				<u-input v-model="client.channel.channelName" type="select" placeholder="请选择渠道" @click="showChannelPop = true" />
			</u-form-item>
			<u-form-item label="客户联系方式:" prop="contactInformation">
				<u-input v-model="clientContactNames" type="select" placeholder="请输入客户联系方式" @click="showContactPop = true" />
			</u-form-item>
			<u-form-item label="备注:">
				<u-input v-model="client.mark" type="textarea" :auto-height="true" height="44" placeholder="请输入备注(选填)" />
			</u-form-item>
		</u-form>
		<u-button class="submit-button" :loading="submiting" :disabled="submiting" @click="onClickSubmit" type="primary">提交</u-button>
		<u-toast ref="uToast" />
		<u-calendar v-model="showCalendar" mode="date" max-date="2099-01-01" @change="onChangeDate"></u-calendar>
		<u-popup v-model="showCompanyPop" mode="center" border-radius="10" width="90%">
			<view class="show-pop">
				<view class="show-pop-title">
					请选择税源地(多选)
				</view>
				<u-checkbox-group :wrap="true" @change="onChangeCompany">
					<u-checkbox v-model="company.checked" v-for="(company, index) in clientCompanyList" :key="index" :name="company._id">
						{{ company.companyName }}
					</u-checkbox>
				</u-checkbox-group>
			</view>
		</u-popup>
		<u-popup v-model="showChannelPop" mode="center" border-radius="10" width="90%">
			<view class="show-pop">
				<view class="show-pop-title">
					请选择渠道(单选)
				</view>
				<u-radio-group v-model="client.channel._id">
					<u-radio v-for="(channel, index) in channelList" :key="index" :name="channel._id" @change="onChangeChannel">
						{{channel.channelName}}
					</u-radio>
				</u-radio-group>
			</view>
		</u-popup>
		<u-popup v-model="showContactPop" mode="center" border-radius="10" width="90%">
			<view class="show-pop">
				<view class="show-pop-title">
					请填写客户联系方式
				</view>
				<u-form class="contact-form" label-width="200" label-position="top">
					<u-form-item label="联系人姓名:">
						<u-input v-model="client.contactInformation.name" placeholder="请输入姓名"/>
					</u-form-item>
					<u-form-item label="联系方式:">
						<u-input v-model="client.contactInformation.phone" placeholder="请输入联系方式"/>
					</u-form-item>
					<u-form-item label="地址:">
						<u-input v-model="client.contactInformation.address" type="textarea" :auto-height="true" height="44" placeholder="请输入地址"/>
					</u-form-item>
				</u-form>
				<u-button @click="onClickContactDone" type="primary">完成</u-button>
			</view>
		</u-popup>
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
					signupTime: null,
					signupPoint: '',
					companyList: [],
					channel: null,
					contactInformation: {
						name: '',
						phone: '',
						address: ''
					},
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
						message: '请输入客户名称',
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
						message: '请输入客户所属公司',
						trigger: ['change', 'blur']
					}]
				},
				submiting: false,
				showCalendar: false,
				// check box 使用
				clientCompanyList: [],
				showCompanyPop: false,
				clientCompanyNames: '',
				showChannelPop: false,
				showContactPop: false,
				clientContactNames: ''
			}
		},
		onLoad(option) {
			if (option.index) {
				this.index = option.index
				this.client = this.clientList[option.index]
				this.isEdit = true
			} else {
				this.clientCompanyList = this.companyList.map(company => {
					return {
						checked: false,
						_id: company._id,
						companyName: company.companyName
					}
				})
			}
		},
		onReady() {
			this.$refs.clientForm.setRules(this.rules);
			if (this.isEdit) {
				uni.setNavigationBarTitle({
					title: '编辑客户'
				})
			}
		},
		computed: {
			...mapGetters(['openid', 'clientList', 'companyList', 'channelList'])
		},
		methods: {
			...mapMutations(['ADDCLIENT', 'UPDATECLIENT']),
			onChangeDate(e) {
				this.client.signupTime = e.result
			},
			onChangeCompany(ids) {
				this.client.companyList = this.companyList.filter(company => ids.includes(company._id))
				this.clientCompanyNames = this.client.companyList.map(company => company.companyName).toString()
			},
			onChangeChannel(id) {
				this.client.channel = this.channelList.filter(channel => channel._id === id)[0]
			},
			onClickContactDone() {
				this.showContactPop = false
				this.clientContactNames = `${this.client.contactInformation.name} ${this.client.contactInformation.phone} ${this.client.contactInformation.address}`
			},
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
		padding: 20px 20px 34px;
		display: flex;
		flex-direction: column;
	}

	.show-pop {
		padding: 20px;
		display: flex;
		flex-direction: column;
	}

	.show-pop-title {
		font-size: 14px;
		font-weight: bold;
		text-align: center;
		margin-bottom: 20px;
	}
	
	.contact-form {
		margin-bottom: 10px;
	}

	.submit-button {
		margin-top: 20px;
	}
</style>
