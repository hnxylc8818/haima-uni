<script>
	export default {
		onLaunch: function () {
			console.log('App Launch')
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "common/base.scss";

    .container {
        height: 100%;
        padding: px2rpx(18) px2rpx(18) px2rpx(35);
    }
    button::after{
      border: none;
    }
    button:active{
      opacity: 0.9;
    }
    .shadow{
      box-shadow: 0 0 px2rpx(10) #E8E8E8;
    }
</style>
