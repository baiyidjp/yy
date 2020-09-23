<template>
	<block v-if="clientList.length > 0">
		<view class="wrap">
			<block v-for="(client, index) in clientList" :key="client._id">
				<client-item :client="client" :index="index" @delete="onClickDelete"></client-item>
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
			<text>当前账号没有添加客户</text>
			<u-button type="primary" @click="onClickAddButton">添加</u-button>
		</view>
	</block>
</template>

<script>
	import ClientItem from './client_item.vue'
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
		components: {
			ClientItem
		},
		onLoad() {},
		computed: {
			...mapGetters(['currentUser', 'clientList'])
		},
		methods: {
			...mapMutations(['DELETECLIENT']),
			onClickAddButton() {
				uni.navigateTo({
					url: './client_add'
				})
			},
			onClickEdit(index) {
				uni.navigateTo({
					url: `./client_add?index=${index}`
				})
			},
			onClickDelete(index) {
				this.deleteIndex = index
				this.showDeleteModal = true
			},
			onClickConfirmDelete() {
				let self = this
				const client = self.clientList[self.deleteIndex]
				if (client.openid === self.currentUser.openid) {
					uniCloud.callFunction({
						name: 'client',
						data: {
							type: 'delete',
							client: self.clientList[self.deleteIndex]
						}
					}).then(res => {
						self.showDeleteModal = false
						if (res.result) {
							self.DELETECLIENT({
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

	
</style>
