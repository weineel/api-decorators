# api decorators

> 使用装饰器实现接口数据(promise 返回的)解析等功能能。

本项目适配了flyio作为网络请求框架，当然可以更换为任意可以使用Promise的库。

## 配置示例

```javascript
// export default from './fetch'
import Options, { fetch, ApiResultError } from 'api-decorators'
import { BaseURL } from '../constant/common'

// fetch(flyio) base url
fetch.config.timeout = 15000
fetch.config.baseURL = BaseURL

Options.success = function(data) {
  return data.status === 200 ? data.data === undefined ? data : data.data : false
}

Options.error = function(data) {
  switch (data.status) {
    case 401:
      // 可以在这里返回继承至 ApiResultError的错误类型
      // 也可以做一些错误的统一处理
      break
    case 422:
      break
    case 500:
      break
    default:
      break
  }
  return new ApiResultError(data.status, data.message, data)
}


```

## 使用示例

```javascript
import fetch from 'flyio'
import { DefaultResolve } from 'api-decorators'

export default class HomeApis {
  @DefaultResolve
  static sampleApi({ num = 1, size = 2 } = { num: 1, size: 2 }) {
    return fetch.get(`sample/api?per_page=${size}&page=${num}`)
  }
}
```

如果接口`sample/api`返回的数据为

```javascript
{
  code: 0,
  message: success,
  data: [{id: 1},{id: 2}]
}
```

HomeApis.sampleApi Promise返回的数据为

```javascript
[{id: 1},{id: 2}]
```
