<template>
	<view class="wrap">
		<u-form class="form-wrap" :model="company" ref="companyForm" label-width="auto">
			<u-form-item label="税源地名称:" prop="companyName">
				<u-input v-model="company.companyName" placeholder="请输入税源地名称" />
			</u-form-item>
			<u-form-item label="大额服务费(%):" prop="serviceCharge">
				<u-input type="digit" v-model="company.serviceCharge" placeholder="请输入税源地大额服务费(0-100)" />
			</u-form-item>
			<u-form-item label="小额服务费(%):" prop="serviceChargeSmall">
				<u-input type="digit" v-model="company.serviceChargeSmall" placeholder="请输入税源地小额服务费(0-100)" />
			</u-form-item>
			<u-form-item label="个税(%):" prop="tax">
				<u-input type="digit" v-model="company.tax" placeholder="请输入税源地个税(0-100)" />
			</u-form-item>
			<u-form-item v-for="(rebate, index) in company.rebates" :key="index" label="返佣信息:">
				<view class="rebate-wrap">
					<u-input type="select" v-model="rebate.date" placeholder="请选择返佣时间" @click="onClickRebateDate(index)"/>
					<u-input type="digit" style="width: 100px" v-model="rebate.scale" placeholder="返佣比例(%)(0-100)" />
					<u-icon v-if="index < 2 & index === company.rebates.length-1" name="plus-circle" size="50" @click="onClickPlusIcon"></u-icon>
					<u-icon v-if="index > 0 & index === company.rebates.length-1" :index=index name="minus-circle" size="50" @click="onClickMinusIcon"></u-icon>
				</view>
			</u-form-item>
			<u-form-item label="备注:">
				<u-input v-model="company.mark" type="textarea" :auto-height="true" height="44" placeholder="请输入备注(选填)" />
			</u-form-item>
		</u-form>
		<u-button class="submit-button" :loading="submiting" :disabled="submiting" @click="onClickSubmit" type="primary">提交</u-button>
		<u-toast ref="uToast" />
		<u-popup v-model="showRebatePop" mode="center" border-radius="10" width="95%" :closeable="true">
			<view class="show-pop">
				<view class="show-pop-title">
					请选择返佣时间(单选)
				</view>
				<u-radio-group v-model="currentRebateType">
					<u-radio v-for="(date, index) in rebateDates" :key="index" :name="index" @change="onChangeRebateDate">
						{{date.date}}
					</u-radio>
				</u-radio-group>
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
				company: {
					companyName: '',
					serviceCharge: '',
					serviceChargeSmall: '',
					tax: '1.5',
					rebates: [{
						date: null,
						scale: null
					}],
					mark: '',
					openid: '',
					createAt: null,
					createBy: null,
					updateAt: null,
					updateBy: null
				},
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
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}, {
						validator: (rule, value, callback) => {
							// 返回true表示校验通过，返回false表示不通过
							return value < 100 && value >= 0
						},
						message: '请输入税源地服务费(小数)',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur']
					}],
					serviceChargeSmall: [{
						required: true,
						message: '请输入税源地小额服务费(小数)',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}, {
						validator: (rule, value, callback) => {
							// 返回true表示校验通过，返回false表示不通过
							return value < 100 && value >= 0
						},
						message: '请输入税源地小额服务费(小数)',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur']
					}],
					tax: [{
						required: true,
						message: '请输入税源地个税(小数)',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}, {
						validator: (rule, value, callback) => {
							// 返回true表示校验通过，返回false表示不通过
							return value < 100 && value >= 0
						},
						message: '请输入税源地个税(小数)',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur']
					}],
				},
				rebateDates: [
					{
						type: 0,
						date: '当天'
					},
					{
						type: 1,
						date: '下周二'
					},
					{
						type: 2,
						date: '次月25号'
					},
				],
				currentRebateIndex: 0,
				showRebatePop: false,
				currentRebateType: -1,
				submiting: false
			}
		},
		onLoad(option) {
			if (option.company) {
				this.company = JSON.parse(option.company)
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
			onClickPlusIcon() {
				this.company.rebates.splice(this.company.rebates.length, 0 , {
					date: null,
					amount: null
				})
			},
			onClickMinusIcon(index) {
				this.company.rebates.splice(index, 1)
			},
			onClickRebateDate(index) {
				this.currentRebateIndex = index
				this.showRebatePop = true
				this.currentRebateType = -1
			},
			onChangeRebateDate(index) {
				const rebateDate = this.rebateDates[index].date
				this.company.rebates[this.currentRebateIndex].date = rebateDate
				this.showRebatePop = false
			},
			onClickSubmit() {
				const self = this
				self.company.openid = self.currentUser.openid
				this.$refs.companyForm.validate(valid => {
					if (valid) {
						self.submiting = true
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
									self.UPDATECOMPANY({
										company: self.company
									})
									self.showToast()
								}
							})
						} else {
							self.company.createAt = Date.now()
							self.company.createBy = self.company.openid
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
	
	.rebate-wrap {
		display: flex;
		align-items: center;
	}
	
	.rebate-wrap u-input {
		margin-right: 5px;
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
