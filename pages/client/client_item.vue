<template>
	<view class="client-item">
		<view class="top-wrap">
			<text class="title">{{ client.clientName }}</text>
			<view class="tag-wrap">
				<u-tag text="删除" type="error" @click="onClickDelete"></u-tag>
				<u-tag class="tag-detail" text="详情" @click="onClickDetail"></u-tag>
			</view>
		</view>
		<text class="sub-title">签约点位: {{ client.signupPoint }}</text>
		<text class="sub-title">税源地: {{ clientCompanyNames }}</text>
		<text class="sub-title">渠道: {{ clientChannelName }}</text>
		<text class="sub-title">备注: {{ client.mark.length > 0 ? client.mark : '无' }}</text>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {}
		},
		props: {
			client: null,
			index: null
		},
		computed: {
			...mapGetters(['companyList', 'channelList']),
			clientCompanyNames() {
				const companyListInfo = this.companyList.filter(company => this.client.companyIds.includes(company._id))
				const names = companyListInfo.map(company => company.companyName)
				if (names.length > 0) {
					let companyNames = names[0]
					if (names.length > 1) {
						companyNames += ` 等(共${names.length}个)`
					}
					return companyNames
				}
				return '无'
			},
			clientChannelName() {
				const channelInfo = this.channelList.filter(channel => channel._id === this.client.channelId)[0]
				return channelInfo.channelName
			}
		},
		methods: {
			onClickDelete() {
				this.$emit('delete', this.index)
			},
			onClickDetail() {
				uni.navigateTo({
					url: `./client_detail?_id=${this.client._id}`
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.client-item {
		margin: 15px;
		padding: 15px;
		border-radius: 5px;
		box-shadow: 1px 1px 5px 2px $u-border-color;
		display: flex;
		flex-direction: column;
	}

	.client-item .top-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.client-item .top-wrap .tag-wrap {
		display: flex;
		align-items: center;
	}

	.tag-wrap .tag-detail {
		margin-left: 5px;
	}

	.client-item .title {
		font-size: 14px;
		font-weight: bold;
		color: $u-main-color;
	}

	.client-item .sub-title {
		margin-top: 5px;
		font-size: 14px;
		color: $u-content-color;
	}
</style>
