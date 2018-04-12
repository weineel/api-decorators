import store from '../store'
import Notification from '../utils/notify'

export class ApiAuthError extends Error {}

export function needLogin(target, name, descriptor) {
  const oFunc = descriptor.value
  descriptor.value = function(...arg) {
    if (store.getters['me/isLogin']) {
      return oFunc.apply(target, arg)
    } else {
      Notification.notify('no-bind', { methodName: name })
      throw new ApiAuthError(`调用'${name}', 需要先登录！`)
    }
  }
  return descriptor
}
