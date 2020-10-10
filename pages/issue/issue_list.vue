<template>
	<block v-if="issueList.length > 0">
		<view class="wrap">
			<block v-for="(issue, index) in issueList" :key="issue._id">
				<view class="issue-item">
					<view class="top-wrap">
						<text class="title">{{ issue.issueName }}</text>
						<view class="tag-wrap">
							<u-tag text="删除" type="error" @click="onClickDelete(index)"></u-tag>
							<u-tag text="编辑" @click="onClickEdit(issue)"></u-tag>
						</view>
					</view>
					<text class="sub-title">大额服务费比例: {{ issue.serviceCharge }}</text>
					<text class="sub-title">小额服务费比例: {{ issue.serviceChargeSmall }}</text>
					<text class="sub-title">个税比例: {{ issue.tax }}</text>
					<text class="sub-title">备注: {{ issue.mark.length > 0 ? issue.mark : '无' }}</text>
				</view>
			</block>
			<view class="add-wrap" @click="onClickAddButton">
				<u-icon name="plus" color="#ffffff" size="60"></u-icon>
			</view>
			<u-toast ref="uToast" />
			<u-modal v-model="showDeleteModal" content="删除后无法恢复,请确认是否删除?" :show-cancel-button="true" confirm-text="删除"
			 confirm-color="#fa3534" :async-close="true" @confirm="onClickConfirmDelete"></u-modal>
		</view>
	</block>
	<block v-else>
		<view class="wrap no-data-wrap">
			<text>当前账号没有添加工单</text>
			<u-button type="primary" @click="onClickAddButton">添加</u-button>
		</view>
	</block>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				showDeleteModal: false,
				deleteIndex: null
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
		computed: {
			...mapGetters(['currentUser', 'issueList'])
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
			onClickDelete(index) {
				this.deleteIndex = index
				this.showDeleteModal = true
			},
			onClickConfirmDelete() {
				let self = this
				const issue = self.issueList[self.deleteIndex]
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
								index: self.deleteIndex
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
			}
		},
	}
</script>

<style lang="scss" scoped>
	.wrap {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.no-data-wrap {
		justify-content: center;
		align-items: center;
	}

	.no-data-wrap u-button {
		margin-top: 10px;
	}

	.add-wrap {
		position: fixed;
		bottom: 10px;
		right: 10px;
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
