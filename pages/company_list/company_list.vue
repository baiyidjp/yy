<template>
	<view class="wrap">
		<block v-for="company in companyList" :key="company._id">
			<text>{{ company.companyName }}</text>
		</block>
		<view class="add-wrap" @click="onClickAddButton">
			<u-icon name="plus" color="#ffffff" size="60"></u-icon>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
			};
		},
		onLoad() {
		},
		computed: {
			...mapGetters(['openid', 'companyList'])
		},
		methods: {
			onClickAddButton() {
				uni.navigateTo({
					url: './company_add'
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
</style>
