<template>
	<view class="issue-item">
		<view class="top-wrap">
			<text class="title">{{ checkedClient.clientName }}</text>
			<u-tag :text="issue.isFinish ? '已完成' : '未完成'" :type="issue.isFinish ? 'primary' : 'warning'"></u-tag>
		</view>
		<text class="sub-title">渠道: {{ checkedChannel.channelName }}</text>
		<text class="sub-title">税源地: {{ checkedCompany.companyName }}</text>
		<text class="sub-title">众包费: {{ issue.totalAmount }}</text>
		<text class="sub-title">税源地应得: {{ issue.serviceChargeAmount }}</text>
		<text class="sub-title">渠道应得: {{ issue.channelAmount }}</text>
		<text class="sub-title">个人应得: {{ issue.myAmount }}</text>
		<block v-for="rebateInfo in issue.rebateInfoList" :key="rebateInfo.date">
			<text class="sub-title">返佣时间: {{ rebateInfo.date}} 应返佣: {{ rebateInfo.amount}}</text>
		</block>
		<text class="sub-title">备注: {{ issue.mark.length > 0 ? issue.mark : '无' }}</text>
		<u-button class="flag-button" @click="onClickFlagButton" :type="issue.isFinish ? 'warning' : 'primary'">{{ issue.isFinish ? '标记为未完成' : '标记为已完成' }}</u-button>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				issueId: ''
			}
		},
		onLoad(option) {
			if (option._id) {
				this.issueId = option._id
			}
		},
		computed: {
			...mapGetters(['issueList', 'clientList', 'channelList', 'companyList']),
			issue() {
				return this.issueList.find(issue => issue._id === this.issueId)
			},
			checkedClient() {
				if (this.issue) {
					return this.clientList.find(client => client._id === this.issue.clientId)
				}
			},
			checkedCompany() {
				if (this.issue) {
					return	this.companyList.find(company => company._id === this.issue.companyId)
				}
			},
			checkedChannel() {
				if (this.issue) {
					return	this.channelList.find(channle => channle._id === this.checkedClient.channelId)
				}
			}
		},
		methods: {
			onClickFlagButton() {
				const self = this
				self.issue.isFinish = !self.issue.isFinish
				self.issue.updateAt = Date.now()
				self.issue.updateBy = self.issue.openid
				uniCloud.callFunction({
					name: 'issue',
					data: {
						type: 'update',
						issue: self.issue
					}
				}).then(res => {
					
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
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
	
	.flag-button {
		margin-top: 20px;
	}
</style>
