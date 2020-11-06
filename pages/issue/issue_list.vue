<template>
	<block v-if="issueList.length > 0">
		<view class="wrap">
			<view class="dropdowns-wrap">
				<u-dropdown :height="'40px'" @open="onOpenDropdwonItem">
					<u-dropdown-item v-model="filterInfoValue.currentYear" :title="filterInfoLabel.year" :options="issueYears" :height="dropdownItemListHeight"></u-dropdown-item>
					<u-dropdown-item v-model="filterInfoValue.currentMonth" :title="filterInfoLabel.month" :options="issueMonths" :height="dropdownItemListHeight"></u-dropdown-item>
					<u-dropdown-item v-model="filterInfoValue.currentDay" :title="filterInfoLabel.day" :options="issueDays" :height="dropdownItemListHeight"></u-dropdown-item>
					<u-dropdown-item v-model="filterInfoValue.currentRebateStatus" :title="filterInfoLabel.rebateStatus" :options="issueRebateStatuses" :height="dropdownItemListHeight"></u-dropdown-item>
				</u-dropdown>
			</view>
			<block v-for="(issue, index) in issueList" :key="issue._id">
				<issue-item :issue="issue" @delete="onClickDelete(issue)"></issue-item>
			</block>
			<view class="buttons-wrap">
<!-- 				<view class="button-icon" @click="onClickFilterButton">
					<u-icon name="list" color="#ffffff" size="60"></u-icon>
				</view> -->
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
			<text>当前账号没有添加业务单</text>
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
		},
		onShow() {
			const defaultObj = {
				label: '全部',
				value: ''
			}
			const allRebateDataInfo = this.issueList.map(issue => issue.rebateInfoList).flat()
			const years = Array.from(new Set([...allRebateDataInfo.map(dateInfo => dateInfo.year)])).sort().map(year => {
				return {
					label: year,
					value: year
				}
			})
			this.issueYears = [defaultObj, ...years]
			
			const months = Array.from(new Set([...allRebateDataInfo.map(dateInfo => dateInfo.month)])).sort().map(month => {
				return {
					label: month,
					value: month
				}
			})
			this.issueMonths = [defaultObj, ...months]
			
			const days = Array.from(new Set([...allRebateDataInfo.map(dateInfo => dateInfo.day)])).sort().map(day => {
				return {
					label: day,
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
				let day = '选择天'
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
			}
		},
		methods: {
			...mapMutations(['DELETEISSUE', 'UPDATEISSUELIST']),
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
				const height = getApp().globalData.screenHeight - getApp().globalData.navigationBarHeight - 40 - getApp().globalData.bottomArea - 50
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		display: flex;
		flex-direction: column;
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
