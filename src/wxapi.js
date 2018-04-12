import axios from 'axios'
import Vue from 'vue'

const debug = require('debug')('wxapi:')

export default class WXFetch {
  /** 分页获取活动列表 */
  static wxjsapiConfig() {
    return axios.get(`/oauth2/GetJsSdkUiPackage?url=${encodeURIComponent(window.location.href.split('#')[0])}`)
  }
}

export async function doConfig() {
  try {
    const data = await WXFetch.wxjsapiConfig()
    const config = data.data
    debug('config: %o', config)
    debug('Vue.wechat: %o', Vue.wechat)
    Vue.wechat.config({
      debug: process.env.NODE_ENV === 'development',  // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: config.AppId,  // 必填，公众号的唯一标识
      timestamp: config.Timestamp,  // 必填，生成签名的时间戳
      nonceStr: config.NonceStr,  // 必填，生成签名的随机串
      signature: config.Signature,  // 必填，签名，见附录1
      jsApiList: [
        'chooseImage',
        'uploadImage'
      ]  // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    })
  } catch (ex) {
    debug(ex)
  }
}
