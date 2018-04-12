const Options = {
  baseURL: '',
  success(data) {
    return data.status === 0 ? data.data === undefined ? data : data.data : false
  },
  error(data) {
    switch (data.status) {
      case 500:
        // 可以在这里返回继承至 ApiResultError的错误类型
        // 也可以做一些错误的统一处理
        break
      default:
        break
    }
    return new ApiResultError(data.status, data.message, data)
  }
}

export default Options
