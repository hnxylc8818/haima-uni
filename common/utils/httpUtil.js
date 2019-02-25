
Promise.prototype.finally = function (callback) {
  const P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => {
      throw reason
    })
  );
};

export default function request(config = {}) {
  return new Promise(function (resolve, reject) {
    let options = config;

    // 替换项目请求的域名
    options.url = "https://hmapi.haima101.com" + options.url;

    const token = uni.getStorageSync('hmtoken');
    let contentType = options.method ? options.method === "GET" ? "application/json" : "application/json" : "application/json";
    options.header = {
      'Content-Type': contentType,
      'hmtoken': `${token}`
    };
    let showLoading = true;
    if (options.showLoading != undefined) {
      showLoading = options.showLoading;
    }
    let loadingMask = true;
    if (options.loadingMask != undefined){
      loadingMask = options.loadingMask;
    }
    if (showLoading) {
      uni.showLoading({
        title: options.loadingMsg ? options.loadingMsg : "加载中",
        mask:loadingMask,
      });
    }

    uni.request(options).then(r => {
			if(Array.isArray(r)){
				if(r.length > 1){
					r = r[1];
				}else{
					r = r[0];
				}
			}
			console.log("r",r)
      if (r.statusCode === 200) {
        // wepy.$instance.globalData.AuthErrorCount = 0;
        uni.hideLoading();
        resolve(r);
      } else {
        if (r.statusCode === 401) {
          // token失效，需要重新登录
          uni.hideLoading();
          // console.log("AuthErrorCount：" + wepy.$instance.globalData.AuthErrorCount);
          // wepy.$instance.globalData.AuthErrorCount++;
          // wepy.$instance.globalData.isReLogin = true;
//           if (!wepy.$instance.globalData.isToLogin) {
//             wepy.$instance.toLogin();
//           }
        } else {
          uni.hideLoading();
          reject(r);
        }
      }
    }).catch(e =>{
      console.log('catch e',e);
      uni.hideLoading();
      reject(e);
    });
  })
}
