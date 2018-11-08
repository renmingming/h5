const utils = {
	urlPrefix: 'https://apinyx.chuangshangapp.com/',
	// urlPrefix: 'https://devapi.chuangshangapp.com/',
	// urlPrefix: 'http://192.168.66.111:8081/nyx-api/',
	photoPrefix: 'https://photo.l99.com/', 
	request: function(paras) { //获取url参数
		let match = RegExp(`[?&]${paras}=([^&]*)`).exec(window.location.href);
  		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
	},
}

export default utils;