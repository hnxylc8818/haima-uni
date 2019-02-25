import request from '../common/utils/httpUtil.js'
import {httpUrl} from '../common/utils/httpUrl.js'

export default {

  data(){
		return{
			httpUrl:httpUrl
		}
  },
	methods:{
		// 发送短信验证码
		sendSmsCode_Mixin(phoneNumber,resolve,reject,showLoading = true){
		  let data = {
		    "telephone":phoneNumber
		  };
		  this.sendRequest(httpUrl.sendSmsCode, 'POST', data, resolve, reject, showLoading);
		},
		
		// 发送请求，封装错误提示等冗余代码
		sendRequest(url,method,data,resolve,reject,showLoading = true,loadingMask = true){
		  request({
		    url: url,
		    method: method,
		    data: data,
		    showLoading:showLoading,
		    loadingMask:loadingMask,
		  }).then((res) => {
		    console.log("res",res);
		    if (res.data && res.data.success) {
		      console.log("request success");
		      resolve && resolve(res.data.data)
		    } else {
		      console.error("request fail");
		      let errData = {
		        isError:false,
		        errCode:res.data.errcode?res.data.errcode:"-1",
		        msg:res.data.message
		      };
		      reject && reject(errData);
		      let msg = "服务器繁忙，请稍后再试";
		      if (res.data.message) {
		        console.error("exception：" + res.data.message);
		        msg = res.data.message;
		      }
		      uni.showToast({
		        title: msg,
		        icon: "none"
		      });
		    }
		  }).catch((err) => {
		    let errMsg = "";
		    if (typeof err == 'object' && Object.prototype.toString.call(err).toLowerCase() == "[object object]" && !err.length){
		      console.error("request error：" + JSON.stringify(err));
		      errMsg = err.errMsg;
		    }else {
		      console.error("request error：" + err);
		      errMsg = err;
		    }
		
		    let errData = {
		      isError:true,
		      errCode:err.statusCode?err.statusCode:"-1",
		      msg:errMsg
		    };
		    reject && reject(errData);
		    uni.showToast({
		      title: "服务器繁忙，请稍后再试",
		      icon: "none"
		    })
		  })
		}
	}
}
