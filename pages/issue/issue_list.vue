<template>
	<block v-if="issueList.length > 0">
		<view class="wrap">
			<view class="dropdowns-wrap">
				<u-dropdown :height="'40px'" @open="onOpenDropdwonItem" @close="onCloseDropdwonItem">
					<u-dropdown-item v-model="filterInfoValue.currentYear" :title="filterInfoLabel.year" :options="issueYears" :height="dropdownItemListHeight"></u-dropdown-item>
					<u-dropdown-item v-model="filterInfoValue.currentMonth" :disabled="!dropdownItemMothAbled" :title="filterInfoLabel.month" :options="issueMonths"
					 :height="dropdownItemListHeight"></u-dropdown-item>
					<u-dropdown-item v-model="filterInfoValue.currentDay" :disabled="!dropdownItemDayAbled" :title="filterInfoLabel.day" :options="issueDays" :height="dropdownItemListHeight"></u-dropdown-item>
					<u-dropdown-item v-model="filterInfoValue.currentRebateStatus" :title="filterInfoLabel.rebateStatus" :options="issueRebateStatuses"
					 :height="dropdownItemListHeight"></u-dropdown-item>
				</u-dropdown>
			</view>
			<view class="total-amount-wrap">
				<view class="rebate-wrap">
					<text class="text-top">总返佣</text>
					<text class="text-bottom total-text">{{ totalAmount }}</text>
				</view>
				<view class="rebate-wrap">
					<text class="text-top">已返佣</text>
					<text class="text-bottom finish-text">{{ finishAmount }}</text>
				</view>
				<view class="rebate-wrap">
					<text class="text-top">未返佣</text>
					<text class="text-bottom unfinish-text">{{ unfinishAmount }}</text>
				</view>
			</view>
			<block v-for="(issue, index) in showIssueList" :key="issue._id">
				<issue-item :issue="issue" @delete="onClickDelete(issue)"></issue-item>
			</block>
			<view class="buttons-wrap">
				<view class="button-icon" @click="onClickAddButton">
					<u-icon name="plus" color="#ffffff" size="60"></u-icon>
				</view>
			</view>
			<u-toast ref="uToast" />
			<u-modal v-model="showDeleteModal" content="删除后无法恢复,请确认是否删除?" :show-cancel-button="true" confirm-text="删除"
			 confirm-color="#fa3534" :async-close="true" @confirm="onClickConfirmDelete" @cancel="onClickCancelDelete"></u-modal>
		</view>
	</block>
	<block v-else>
		<view class="wrap no-data-wrap">
			<text>当前状态暂无业务单</text>
			<u-button type="primary" @click="onClickAddButton">添加</u-button>
		</view>
	</block>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import IssueItem from './issue_item.vue'
	export default {
		data() {
			return {
				showIssueList: [],
				showDeleteModal: false,
				deleteIssue: null,
				dropdownItemListHeight: 'auto',
				showFilterPop: false,
				filterInfoValue: {
					currentYear: '',
					currentMonth: '',
					currentDay: '',
					currentRebateStatus: ''
				},
				issueYears: [],
				issueMonths: [],
				issueDays: [],
				issueRebateStatuses: []
			};
		},
		onPullDownRefresh() {
			const self = this
			// 震动
			uni.vibrateShort()
			uniCloud.callFunction({
				name: 'issue',
				data: {
					type: 'get',
					openid: self.currentUser.openid
				}
			}).then(res => {
				self.UPDATEISSUELIST({
					issueList: res.result.data
				})
				uni.stopPullDownRefresh()
			})
		},
		onLoad() {
			this.issueRebateStatuses = [{
				label: '全部',
				value: '',
			}, {
				label: '已完成',
				value: 'finish',
			}, {
				label: '未完成',
				value: 'unfinish',
			}]
			this.filterIssueList()
		},
		onShow() {
			const defaultObj = {
				label: '全部',
				value: ''
			}
			const allRebateDataInfo = this.issueList.map(issue => issue.rebateInfoList).flat()
			const years = Array.from(new Set([...allRebateDataInfo.map(dateInfo => dateInfo.year)])).sort().map(year => {
				return {
					label: year + '年',
					value: year
				}
			})
			this.issueYears = [defaultObj, ...years]

			const months = Array.from(new Set([...allRebateDataInfo.map(dateInfo => dateInfo.month)])).sort().map(month => {
				return {
					label: month + '月',
					value: month
				}
			})
			this.issueMonths = [defaultObj, ...months]

			const days = Array.from(new Set([...allRebateDataInfo.map(dateInfo => dateInfo.day)])).sort().map(day => {
				return {
					label: day + '日',
					value: day
				}
			})
			this.issueDays = [defaultObj, ...days]
		},
		components: {
			IssueItem
		},
		computed: {
			...mapGetters(['currentUser', 'issueList']),
			filterInfoLabel() {
				let year = '选择年'
				const yearInfo = this.issueYears.find(year => year.value === this.filterInfoValue.currentYear)
				if (yearInfo && yearInfo.value.length > 0) {
					year = yearInfo.label
				}
				let month = '选择月'
				const monthInfo = this.issueMonths.find(month => month.value === this.filterInfoValue.currentMonth)
				if (monthInfo && monthInfo.value.length > 0) {
					month = monthInfo.label
				}
				let day = '选择日'
				const dayInfo = this.issueDays.find(day => day.value === this.filterInfoValue.currentDay)
				if (dayInfo && dayInfo.value.length > 0) {
					day = dayInfo.label
				}
				let rebateStatus = '选择状态'
				const rebateStatusInfo = this.issueRebateStatuses.find(rebateStatus => rebateStatus.value === this.filterInfoValue.currentRebateStatus)
				if (rebateStatusInfo && rebateStatusInfo.value.length > 0) {
					rebateStatus = rebateStatusInfo.label
				}
				return {
					year,
					month,
					day,
					rebateStatus
				}
			},
			dropdownItemMothAbled() {
				return this.filterInfoValue.currentYear.length > 0
			},
			dropdownItemDayAbled() {
				return this.filterInfoValue.currentYear.length > 0 && this.filterInfoValue.currentMonth.length > 0
			},
			totalAmount() {
				if (this.showIssueList.length > 0) {
					return this.showRebateInfoList.reduce((accumulator, currentValue) => {
						return parseFloat(accumulator) + parseFloat(currentValue.amount)
					}, 0)
				}
				return 0
			},
			finishAmount() {
				const finishRebateInfoList = this.showRebateInfoList.filter(rebateInfo => rebateInfo.isFinish)
				if (finishRebateInfoList.length > 0) {
					return finishRebateInfoList.reduce((accumulator, currentValue) => {
						return parseFloat(accumulator) + parseFloat(currentValue.amount)
					}, 0)
				}
				return 0
			},
			unfinishAmount() {
				const unfinishRebateInfoList = this.showRebateInfoList.filter(rebateInfo => !rebateInfo.isFinish)
				if (unfinishRebateInfoList.length > 0) {
					return unfinishRebateInfoList.reduce((accumulator, currentValue) => {
						return parseFloat(accumulator) + parseFloat(currentValue.amount)
					}, 0)
				}
				return 0
			},
			showRebateInfoList() {
				return this.showIssueList.map(issue => issue.rebateInfoList).flat()
			}
		},
		methods: {
			...mapMutations(['DELETEISSUE', 'UPDATEISSUELIST']),
			filterIssueList() {
				const self = this
				this.showIssueList = this.issueList
				if (this.filterInfoValue.currentYear.length > 0) {
					this.showIssueList = this.showIssueList.filter(issue => {
						const filterRebateInfo = issue.rebateInfoList.filter(rebate => rebate.year === self.filterInfoValue.currentYear)
						return filterRebateInfo && filterRebateInfo.length > 0 ? true : false
					})
				}
				if (this.filterInfoValue.currentMonth.length > 0) {
					this.showIssueList = this.showIssueList.filter(issue => {
						const filterRebateInfo = issue.rebateInfoList.filter(rebate => {
							return rebate.month === self.filterInfoValue.currentMonth && rebate.year === self.filterInfoValue.currentYear
						})
						return filterRebateInfo && filterRebateInfo.length > 0 ? true : false
					})
				}
				if (this.filterInfoValue.currentDay.length > 0) {
					this.showIssueList = this.showIssueList.filter(issue => {
						const filterRebateInfo = issue.rebateInfoList.filter(rebate => {
							return rebate.day === self.filterInfoValue.currentDay && rebate.month === self.filterInfoValue.currentMonth && rebate.year === self.filterInfoValue.currentYear
						})
						return filterRebateInfo && filterRebateInfo.length > 0 ? true : false
					})
				}
				if (this.filterInfoValue.currentRebateStatus.length > 0) {
					let finish = true
					if (this.filterInfoValue.currentRebateStatus === 'unfinish') {
						finish = false
					}
					this.showIssueList = this.showIssueList.filter(issue => {
						return issue.issueFinish === finish
					})
				}
				if (this.showIssueList.length === 0) {
					self.$refs.uToast.show({
						title: '查询不到当前状态的业务单',
						type: 'warning'
					})
				}
			},
			onClickAddButton() {
				uni.navigateTo({
					url: './issue_add'
				})
			},
			onClickEdit(issue) {
				uni.navigateTo({
					url: `./issue_add?issue=${JSON.stringify(issue)}`
				})
			},
			onClickDelete(issue) {
				this.deleteIssue = issue
				this.showDeleteModal = true
			},
			onClickCancelDelete() {
				this.deleteIssue = null
			},
			onClickConfirmDelete() {
				let self = this
				if (!self.deleteIssue) {
					return
				}
				const issue = self.deleteIssue
				if (issue.openid === self.currentUser.openid) {
					uniCloud.callFunction({
						name: 'issue',
						data: {
							type: 'delete',
							issue: issue
						}
					}).then(res => {
						self.showDeleteModal = false
						if (res.result) {
							self.DELETEISSUE({
								issue: issue
							})
							self.$refs.uToast.show({
								title: '删除成功',
								type: 'success'
							})
							self.filterIssueList()
						}
					})
				} else {
					self.$refs.uToast.show({
						title: '无权删除',
						type: 'error'
					})
				}
			},
			onOpenDropdwonItem(index) {
				const height = getApp().globalData.screenHeight - getApp().globalData.navigationBarHeight - 40 - getApp().globalData
					.bottomArea - 50
				if (index === 0 && this.issueYears.length * 53 > height) {
					this.dropdownItemListHeight = `${height}px`
				} else if (index === 1 && this.issueMonths.length * 53 > height) {
					this.dropdownItemListHeight = `${height}px`
				} else if (index === 2 && this.issueDays.length * 53 > height) {
					this.dropdownItemListHeight = `${height}px`
				} else if (index === 3 && this.issueRebateStatuses.length * 53 > height) {
					this.dropdownItemListHeight = `${height}px`
				} else {
					this.dropdownItemListHeight = 'auto'
				}
			},
			onCloseDropdwonItem() {
				if (this.filterInfoValue.currentYear.length <= 0) {
					this.filterInfoValue.currentMonth = ''
					this.filterInfoValue.currentDay = ''
				}
				if (this.filterInfoValue.currentMonth.length <= 0) {
					this.filterInfoValue.currentDay = ''
				}
				this.filterIssueList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		display: flex;
		flex-direction: column;
	}

	.total-amount-wrap {
		height: 60px;
		border-top: 1px solid  $u-border-color;
		border-bottom: 1px solid  $u-border-color;
		padding: 0 15px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: $u-content-color;
		font-size: 14px;
	}
	.total-amount-wrap .rebate-wrap {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.total-amount-wrap .text-top {
		margin-bottom: 5px;
	}
	.total-amount-wrap .text-bottom {
		font-size: 16px;
		color: $u-content-color;
		font-weight: bold;
	}
	.total-amount-wrap .finish-text {
		color: $u-type-success;
	}
	.total-amount-wrap .unfinish-text {
		color: $u-type-error;
	}
	
	.no-data-wrap {
		height: 100vh;
		justify-content: center;
		align-items: center;
	}

	.no-data-wrap u-button {
		margin-top: 10px;
	}

	.buttons-wrap {
		position: fixed;
		bottom: 10px;
		right: 10px;
		width: 44px;
		height: 94px;
		display: flex;
		flex-direction: column-reverse;
		justify-content: space-between;
		align-items: center;
	}

	.buttons-wrap .button-icon {
		width: 44px;
		height: 44px;
		background-color: $u-type-primary;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.issue-item {
		margin: 15px;
		padding: 15px;
		border-radius: 5px;
		box-shadow: 1px 1px 5px 2px $u-border-color;
		display: flex;
		flex-direction: column;
	}

	.issue-item .top-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.issue-item .top-wrap .tag-wrap {
		display: flex;
		align-items: center;
	}

	.tag-wrap u-tag {
		margin-left: 5px;
	}

	.issue-item .title {
		font-size: 14px;
		font-weight: bold;
		color: $u-main-color;
	}

	.issue-item .sub-title {
		margin-top: 5px;
		font-size: 14px;
		color: $u-content-color;
	}
</style>
