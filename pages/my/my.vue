<template>
	<view>
		<view>部分已知问题(红色是未解决)</view>
		<view style="color: green;">1. 客户中的渠道和税源地应该是可更新的,现在是选择后就直接写死,一旦编辑了税源地或者渠道,对应的客户的不会更新</view>
		<view style="color: red;">2. 客户详情的UI页面需要优化</view>
		<view style="color: red;">3. 客户,渠道,税源地的列表展示的信息布局需要优化下</view>
		<view style="color: green;">4. 创建并展示业务单单</view>
		<u-button v-if="currentUser.isAdmin" type="primary" @click="onClickAllUserButton">用户列表</u-button>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				
			};
		},
		computed: {
			...mapGetters(['currentUser'])
		},
		methods: {
			onClickAllUserButton() {
				uni.navigateTo({
					url: '../user/user_list'
				})
			}
		},
	}
</script>

<style lang="scss">

</style>
