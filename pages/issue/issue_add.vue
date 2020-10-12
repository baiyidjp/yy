<template>
	<view class="wrap">
		<u-form class="form-wrap" :model="issue" ref="issueForm" label-width="160">
			<u-form-item label="工单客户:" prop="clientName">
				<u-input type="select" :value="checkedClient.clientName" placeholder="请选择客户" @click="onClickClientList" />
			</u-form-item>
			<u-form-item label="税源地:" prop="companyName">
				<u-input type="select" :value="checkedCompanyName" placeholder="请选择税源地" @click="onClickCompanyList" />
			</u-form-item>
			<u-form-item v-if="checkedCompany" label="服务费类型:">
				<u-radio-group v-model="issue.companyServiceCharge">
					<u-radio :name="checkedCompany.serviceCharge">大额({{ checkedCompany.serviceCharge || 0 }})</u-radio>
					<u-radio :name="checkedCompany.serviceChargeSmall">小额({{ checkedCompany.serviceChargeSmall || 0 }})</u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item v-if="checkedCompany" label="众包费:">
				<u-input v-model="issue.totalAmount" type="digit" placeholder="请输入总金额(数字)" />
			</u-form-item>
			<u-form-item v-if="checkedCompany" label="服务费:">
				<u-input :value="serviceCharge" type="digit" :disabled="true" placeholder="税源地服务费" />
			</u-form-item>
			<u-form-item v-if="checkedCompany" label="渠道应得:">
				<u-input :value="channelAmount" type="number" :disabled="true" placeholder="渠道应得费" />
			</u-form-item>
			<u-form-item v-if="checkedCompany" label="个人应得:">
				<u-input :value="myAmount" type="number" :disabled="true" placeholder="个人所得" />
			</u-form-item>
			<u-form-item label="打款时间:" prop="makeMoneyTime">
				<u-input :value="issue.makeMoneyTime" type="select" placeholder="请选择预计打款时间" @click="showCalendar = true" />
			</u-form-item>
			<u-form-item label="备注:">
				<u-input v-model="issue.mark" type="textarea" :auto-height="true" height="44" placeholder="请输入备注(选填)" />
			</u-form-item>
		</u-form>
		<u-button class="submit-button" :loading="submiting" :disabled="submiting" @click="onClickSubmit" type="primary">提交</u-button>
		<u-toast ref="uToast" />
		<u-modal v-model="showClientModal" content="暂无客户,是否去添加?" :show-cancel-button="true" confirm-text="添加" @confirm="onClickConfirmClient"></u-modal>
		<u-popup v-model="showClientPop" mode="center" border-radius="10" width="95%" :closeable="true">
			<view class="show-pop">
				<view class="show-pop-title">
					请选择客户(单选)
				</view>
				<u-radio-group v-model="checkedClient._id" :wrap="true">
					<u-radio v-for="(client, index) in issueClientList" :key="index" :name="client._id" @change="onChangeClient">
						{{client.clientName}}
					</u-radio>
				</u-radio-group>
			</view>
		</u-popup>
		<u-modal v-model="showCompanyModal" content="请先选择客户" @confirm="onClickClientList"></u-modal>
		<u-popup v-model="showCompanyPop" mode="center" border-radius="10" width="95%" :closeable="true">
			<view class="show-pop">
				<view class="show-pop-title">
					请选择税源地(单选)
				</view>
				<u-radio-group v-model="checkedCompany._id" :wrap="true">
					<u-radio v-for="(company, index) in checkedClientCompanyList" :key="index" :name="company._id" @change="onChangeCompany">
						{{company.companyName}}
					</u-radio>
				</u-radio-group>
			</view>
		</u-popup>
		<u-calendar v-model="showCalendar" mode="date" max-date="2099-01-01" @change="onChangeDate"></u-calendar>
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
				issue: {
					clientId: '',
					companyId: '',
					totalAmount: 0,
					companyServiceCharge: 0,
					makeMoneyTime: '',
					mark: '',
					openid: '',
					createAt: null,
					createBy: null,
					updateAt: null,
					updateBy: null
				},
				isEdit: false,
				rules: {
					clientName: [{
						validator: (rule, value, callback) => {
							// 返回true表示校验通过，返回false表示不通过
							return value.length > 0
						},
						message: '请选择客户(单选)',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur']
					}],
					companyName: [{
						validator: (rule, value, callback) => {
							// 返回true表示校验通过，返回false表示不通过
							return value.length > 0
						},
						message: '请选择税源地(单选)',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur']
					}],
					makeMoneyTime: [{
						validator: (rule, value, callback) => {
							// 返回true表示校验通过，返回false表示不通过
							return value.length > 0 ? true : false
						},
						message: '请选择打款时间',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur']
					}]
				},
				submiting: false,
				showClientModal: false,
				showClientPop: false,
				issueClientList: [],
				checkedClient: null,
				checkedChannel: null,
				showCompanyModal: false,
				showCompanyPop: false,
				checkedClientCompanyList: [],
				checkedCompany: null,
				showCalendar: false
			}
		},
		onLoad(option) {
			if (option.issue) {
				this.issue = JSON.parse(option.issue)
				this.isEdit = true
			}
		},
		onShow() {
			let self = this
			self.issueClientList = self.clientList.map(client => {
				return {
					checked: self.issue.clientId === client._id,
					_id: client._id,
					clientName: client.clientName
				}
			})
		},
		onReady() {
			this.$refs.issueForm.setRules(this.rules);
			if (this.isEdit) {
				uni.setNavigationBarTitle({
					title: '编辑工单'
				})
			}
		},
		computed: {
			...mapGetters(['currentUser', 'issueList', 'clientList', 'channelList', 'companyList']),
			checkedCompanyName() {
				return this.checkedCompany ? this.checkedCompany.companyName : ''
			},
			serviceCharge() {
				const amount = this.issue.totalAmount * this.issue.companyServiceCharge
				return amount.toFixed(2)
			},
			channelAmount() {
				if (this.checkedClient && this.checkedCompany) {
					const amount = this.issue.totalAmount * (this.checkedClient.signupPoint - this.checkedChannel.quotationPoint) *
						(1 - this.checkedCompany.tax)
					return amount.toFixed(2)
				}
				return 0
			},
			myAmount() {
				if (this.checkedClient && this.checkedCompany) {
					const amount = this.issue.totalAmount * (this.checkedChannel.quotationPoint - this.issue.companyServiceCharge) *
						(1 - this.checkedCompany.tax)
					return amount.toFixed(2)
				}
				return 0
			}
		},
		methods: {
			...mapMutations(['ADDISSUE', 'UPDATEISSUE']),
			onClickConfirmClient() {
				uni.navigateTo({
					url: '../client/client_add'
				})
			},
			onClickClientList() {
				if (this.clientList.length > 0) {
					this.showClientPop = true
				} else {
					this.showClientModal = true
				}
			},
			onChangeClient(id) {
				this.issue.clientId = id
				this.checkedClient = this.clientList.find(client => client._id === id)
				this.checkedClientCompanyList = this.companyList.filter(company => this.checkedClient.companyIds.includes(company._id))
				this.checkedChannel = this.channelList.find(channel => channel._id === this.checkedClient.channelId)
				// 清空已选择的税源地
				this.issue.companyId = ''
				this.checkedCompany = null
			},
			onClickCompanyList() {
				if (this.checkedClientCompanyList.length > 0) {
					this.showCompanyPop = true
				} else {
					this.showCompanyModal = true
				}
			},
			onChangeCompany(id) {
				this.issue.companyId = id
				this.checkedCompany = this.companyList.find(company => company._id === id)
				this.issue.companyServiceCharge = this.checkedCompany.serviceCharge
			},
			onChangeDate(e) {
				this.issue.makeMoneyTime = e.result
			},
			onClickSubmit() {
				const self = this
				self.issue.openid = self.currentUser.openid
				this.$refs.issueForm.validate(valid => {
					if (valid) {
						self.submiting = true
						if (self.isEdit) {
							self.issue.updateAt = Date.now()
							self.issue.updateBy = self.issue.openid
							uniCloud.callFunction({
								name: 'issue',
								data: {
									type: 'update',
									issue: self.issue
								}
							}).then(res => {
								if (res.result) {
									self.UPDATEISSUE({
										issue: self.issue
									})
									self.showToast()
								}
							})
						} else {
							self.issue.createAt = Date.now()
							self.issue.createBy = self.issue.openid
							uniCloud.callFunction({
								name: 'issue',
								data: {
									type: 'add',
									issue: self.issue
								}
							}).then(res => {
								if (res.result.id) {
									self.issue._id = res.result.id
									self.ADDISSUE({
										issue: self.issue
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

	.submit-button {
		margin-top: 20px;
	}
</style>
