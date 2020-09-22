<template>
	<view class="wrap">
		<block v-for="(company, index) in companyList" :key="company._id">
			<view class="company-item">
				<view class="top-wrap">
					<text class="title">{{ company.companyName }}</text>
					<u-tag text="编辑" @click="onClickEdit(index)"></u-tag>
				</view>				
				<text class="sub-title">大额服务费比例: {{ company.serviceCharge }}</text>
				<text class="sub-title">小额服务费比例: {{ company.serviceChargeSmall }}</text>
				<text class="sub-title">个税比例: {{ company.tax }}</text>
				<text class="sub-title">备注: {{ company.mark.length > 0 ? company.mark : '无' }}</text>
			</view>
		</block>
		<view class="add-wrap" @click="onClickAddButton">
			<u-icon name="plus" color="#ffffff" size="60"></u-icon>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {};
		},
		onLoad() {},
		computed: {
			...mapGetters(['openid', 'companyList'])
		},
		methods: {
			onClickAddButton() {
				uni.navigateTo({
					url: './company_add'
				})
			},
			onClickEdit(index) {
				uni.navigateTo({
					url: `./company_add?index=${index}`
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
	.company-item {
		margin: 15px;
		padding: 15px;
		border-radius: 5px;
		box-shadow: 1px 1px 5px 2px $u-border-color;
		display: flex;
		flex-direction: column;
	}
	.company-item .top-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.company-item .title {
		font-size: 14px;
		font-weight: bold;
		color: $u-main-color;
	}
	.company-item .sub-title {
		margin-top: 5px;
		font-size: 14px;
		color: $u-content-color;
	}
</style>
