<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 获取当前的设备信息
			this.getSystemInfo()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData: {
			// 状态栏的高度
			statusBarHeight: 0,
			// 导航栏的内容高度
			contentBarHeight: 0,
			// 导航栏的整体高度
			navigationBarHeight: 0,
			// 整个手机屏幕的高度
			screenHeight: 0,
			// 整个手机屏幕的宽度
			screenWidth: 0,
			// 屏幕的可用高度 除去底部tabbar
			windowHeight: 0,
			// 底部安全
			bottomArea: 0,
			// 是否是iOS
			isIOS: true,
			// 是否是iPhoneX
			iPhoneX: false,
		},
		methods: {
			getSystemInfo() {
				// 获取当前的设备信息
				const systemInfo = uni.getSystemInfoSync()
				console.log(systemInfo)
				this.globalData.statusBarHeight = systemInfo.statusBarHeight
				// 如果是iOS设备
				if (systemInfo.system.indexOf('iOS') != -1) {
					this.globalData.isIOS = true
					this.globalData.contentBarHeight = 44
					this.globalData.navigationBarHeight = 44 + systemInfo.statusBarHeight
					this.globalData.bottomArea = systemInfo.safeAreaInsets.bottom
					if (this.globalData.bottomArea > 0) {
						this.globalData.iPhoneX = true
					} else {
						this.globalData.iPhoneX = false
					}
				} else {
					this.globalData.isIOS = false
					this.globalData.iPhoneX = false
					this.globalData.bottomArea = systemInfo.safeAreaInsets.bottom
					this.globalData.contentBarHeight = 48
					this.globalData.navigationBarHeight = 48 + systemInfo.statusBarHeight
				}
				this.globalData.screenHeight = systemInfo.screenHeight
				this.globalData.screenWidth = systemInfo.screenWidth
				this.globalData.windowHeight = systemInfo.windowHeight
			},
		},
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
	.u-radio-group .u-radio {
		margin-top: 10px;
	}
	.u-checkbox-group .u-checkbox {
		margin-top: 10px;
	}
</style>
