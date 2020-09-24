<template>
	<view class="wrap">
		<view class="top-wrap">
			<text class="title">{{ client.clientName }}</text>
			<view class="tag-wrap">
				<u-tag text="删除" type="error" @click="onClickDelete"></u-tag>
				<u-tag class="tag-edit" text="编辑" @click="onClickDetail"></u-tag>
			</view>
		</view>
		<text class="sub-title">签约点位: {{ client.signupPoint }}</text>
		<text class="sub-title">税源地: {{ clientCompanyNames }}</text>
		<text class="sub-title">渠道: {{ client.channel.channelName }}</text>
		<text class="sub-title">备注: {{ client.mark.length > 0 ? client.mark : '无' }}</text>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				client: null
			}
		},
		onLoad(option) {
			if (option._id) {
				const findClient = this.clientList.find(client => client._id === option._id)
				if (findClient) {
					this.client = findClient
				}
			}
		},
		computed: {
			...mapGetters(['clientList'])
		},
		methods: {
			onClickDetail() {
				uni.navigateTo({
					url: `./client_add?_id=${this.client._id}`
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.wrap {
		margin: 15px;
		padding: 15px;
		border-radius: 5px;
		box-shadow: 1px 1px 5px 2px $u-border-color;
		display: flex;
		flex-direction: column;
	}

	.wrap .top-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.wrap .top-wrap .tag-wrap {
		display: flex;
		align-items: center;
	}

	.tag-wrap .tag-edit {
		margin-left: 5px;
	}

	.wrap .title {
		font-size: 14px;
		font-weight: bold;
		color: $u-main-color;
	}

	.wrap .sub-title {
		margin-top: 5px;
		font-size: 14px;
		color: $u-content-color;
	}
</style>
