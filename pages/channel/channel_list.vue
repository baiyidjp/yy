<template>
	<block v-if="channelList.length > 0">
		<view class="wrap">
			<block v-for="(channel, index) in channelList" :key="channel._id">
				<view class="channel-item">
					<view class="top-wrap">
						<text class="title">{{ channel.channelName }}</text>
						<view class="tag-wrap">
							<u-tag text="删除" type="error" @click="onClickDelete(index)"></u-tag>
							<u-tag text="编辑" @click="onClickEdit(index)"></u-tag>
						</view>
					</view>
					<text class="sub-title">报价点位: {{ channel.quotationPoint }}</text>
					<text class="sub-title">所属公司: {{ channel.channelCompany }}</text>
					<text class="sub-title">备注: {{ channel.mark.length > 0 ? channel.mark : '无' }}</text>
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
			<text>当前账号没有添加渠道</text>
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
		onLoad() {},
		computed: {
			...mapGetters(['openid', 'channelList'])
		},
		methods: {
			...mapMutations(['DELETECHANNEL']),
			onClickAddButton() {
				uni.navigateTo({
					url: './channel_add'
				})
			},
			onClickEdit(index) {
				uni.navigateTo({
					url: `./channel_add?index=${index}`
				})
			},
			onClickDelete(index) {
				this.deleteIndex = index
				this.showDeleteModal = true
			},
			onClickConfirmDelete() {
				let self = this
				uniCloud.callFunction({
					name: 'channel',
					data: {
						type: 'delete',
						channel: self.channelList[self.deleteIndex]
					}
				}).then(res => {
					self.showDeleteModal = false
					if (res.result) {
						self.DELETECHANNEL({
							index: self.deleteIndex
						})
						self.$refs.uToast.show({
							title: '删除成功',
							type: 'success'
						})
					}
				})
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

	.channel-item {
		margin: 15px;
		padding: 15px;
		border-radius: 5px;
		box-shadow: 1px 1px 5px 2px $u-border-color;
		display: flex;
		flex-direction: column;
	}

	.channel-item .top-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.channel-item .top-wrap .tag-wrap {
		display: flex;
		align-items: center;
	}

	.tag-wrap u-tag {
		margin-left: 5px;
	}

	.channel-item .title {
		font-size: 14px;
		font-weight: bold;
		color: $u-main-color;
	}

	.channel-item .sub-title {
		margin-top: 5px;
		font-size: 14px;
		color: $u-content-color;
	}
</style>
