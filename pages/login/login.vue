<template>
	<view class="login">
		<text class="logo">海马</text>
		<text class="logo-desc">海外就医，马上到！</text>
		<view class="form-view">
			<form @submit="formSubmit">
				<view class="common phone">
					<image src="../../static/img/icon_phone.png" />
					<view class="line"></view>
					<input name="phone" @input="phoneInput" placeholder="手机号码" placeholder-style="color:#CECECE" type="number"
					 confirm-type="next" maxlength="11" />
				</view>
				<view class="common code">
					<image src="../../static/img/icon_lock.png" />
					<view class="line"></view>
					<input name="code" :value="codeValue" placeholder="验证码" placeholder-style="color:#CECECE" type="number"
					 confirm-type="done" maxlength="6" />
					<view class="line"></view>
					<button data="code" id="code" :disabled="codeDisabled" :loading="codeLoading" @click="submitCode" class="send-code">{{codeText}}</button>
				</view>
				<button id="login" :disabled="loginBtnLoading" :loading="loginBtnLoading" form-type="submit" class="login-btn">登录</button>
			</form>
		</view>
		<view class="wechat-login" @click="bindWxLogin">
			<image src="../../static/img/icon_wechat.png" />
			<text>微信登录</text>
		</view>
	</view>
</template>

<script>
	import utils from "../../mixins/utils.js"
	import commonApi from "../../mixins/commonApi.js"
	import {
		httpUrl
	} from "../../common/utils/httpUrl.js"
	export default {
		mixins: [commonApi, utils],
		data() {
			return {
				loginBtnLoading: false,
				currentTime: 60,
				codeText: "发送验证码",
				codeDisabled: false,
				codeLoading: false,
				interval: null,
				codeValue: '',
				phoneNumber: '',
				exit: false,
			};
		},
		methods: {
			phoneInput(e) {
				this.phoneNumber = e.detail.value;
			},
			submitCode() {
				// 获取验证码
				if (!this.checkPhoneNumber(this.phoneNumber)) {
					return;
				}
				// 调用发送验证码接口
				this.sendSmsCode(this.phoneNumber)
			},
			formSubmit(e) {
				console.log("e", e)
				let targetID = e.target.id;
				let phoneNumber = e.detail.value.phone;
				this.phoneNumber = phoneNumber;
				// 登录
				if (!this.checkPhoneNumber(phoneNumber)) {
					return;
				}
				let smsCode = e.detail.value.code;
				if (!smsCode) {
					uni.showToast({
						title: '请输入验证码',
						icon: 'none'
					});
					return;
				}
				// 调用登录
				this.loginBtnLoading = true;
				let loginData = {
					"telephone": phoneNumber,
					"smscode": smsCode,
				};
				let t = this;
				this.sendRequest(httpUrl.login, 'PUT', loginData, res => {
					let accessToken = res.accessToken;
					uni.setStorageSync('hmtoken', accessToken);
					this.loginBtnLoading = false;
					if (this.interval) {
						clearInterval(this.interval);
					}
					uni.showToast({
						title: '登录成功'
					});
					if (this.exit) {
						uni.switchTab({
							url: "../index/index"
						});
					} else {
						let pages = getCurrentPages();
						let prevPage = pages[pages.length - 2]; //上一个页面
						if (prevPage) {
							// console.log("prevPage",prevPage);
							prevPage.onLoad(prevPage.options);
							uni.navigateBack();
						} else {
							console.log("上一个页面实例为空,跳转到index");
							uni.switchTab({
								url: "../index/index"
							});
						}
					}
				}, err => {
					this.loginBtnLoading = false;
				}, false)
			},
			bindWxLogin() {
				uni.showToast({
					title: '即将上线，敬请期待',
					icon: 'none'
				});
			},
			// 发送短信验证码
			sendSmsCode(phoneNumber) {
				this.codeText = "";
				this.codeDisabled = true;
				this.codeLoading = true;
				this.sendSmsCode_Mixin(phoneNumber, res => {
					this.codeLoading = false;
					uni.showToast({
						title: '验证码已发送'
					});
					this.codeValue = res.smscode;
					this.codeText = "60秒";
					if (this.interval) {
						clearInterval(this.interval);
					}
					this.interval = setInterval(fun => {
						this.currentTime--;
						this.codeText = this.currentTime + "秒";
						if (this.currentTime <= 0) {
							clearInterval(this.interval);
							this.codeText = "重新获取";
							this.currentTime = 60;
							this.codeDisabled = false;
						}
					}, 1000);

				}, err => {
					if (this.interval) {
						clearInterval(this.interval);
					}
					this.codeText = "发送验证码";
					this.codeDisabled = false;
					this.codeLoading = false;
				}, false);
			}
		},
		onLoad(options) {
			this.exit = options.exit;
		}
	}
</script>

<style lang="scss">
	@import "../../common/css/base.scss";

	.login {
		display: flex;
		flex-direction: column;

		.logo {
			margin-left: px2rpx(35);
			margin-top: px2rpx(61);
			color: #FE9F05;
			font-size: px2rpx(43);
			font-weight: 600;
		}

		.logo-desc {
			margin-top: px2rpx(18);
			margin-left: px2rpx(35);
			color: #333333;
			font-size: px2rpx(21);
			font-weight: 100;
		}

		.form-view {
			margin-top: px2rpx(52);
			display: flex;
			flex-direction: column;
			align-items: center;

			.common {
				width: px2rpx(335);
				height: px2rpx(49);
				border: 1px solid #A6A6A6;
				border-radius: px2rpx(24);
				display: flex;
				align-items: center;

				input {
					margin-left: px2rpx(11);
					font-size: px2rpx(14);
					color: #333333;
				}

				image {
					margin-left: px2rpx(19);
					width: px2rpx(22);
					height: px2rpx(22);
				}

				.line {
					margin-left: px2rpx(9);
					width: 1px;
					height: px2rpx(15);
					background-color: #A6A6A6;
				}
			}

			.code {
				margin-top: px2rpx(20);

				.send-code {
					background-color: transparent;
					padding: 0;
					color: #FE9F05;
					font-size: px2rpx(14);
					font-weight: 600;
					line-height: px2rpx(18);
				}
			}

			.login-btn {
				margin-top: px2rpx(20);
				width: px2rpx(335);
				height: px2rpx(49);
				line-height: px2rpx(49);
				border-radius: px2rpx(24);
				background-color: #FE9F05;
				color: white;
				font-size: px2rpx(18);
			}
		}

		.wechat-login {
			margin-top: px2rpx(49);
			align-self: center;
			display: flex;
			align-items: center;

			image {
				width: px2rpx(25);
				height: px2rpx(22);
			}

			text {
				margin-left: px2rpx(7);
				color: #333333;
				font-size: px2rpx(18);
			}
		}
	}
</style>
