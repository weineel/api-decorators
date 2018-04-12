# api decorators

> 使用装饰器实现接口数据(promise 返回的)解析等功能能。

本项目依赖了flyio作为网络请求框架，当然可以更换为任意可以使用Promise的库，需要重新`src/fetch.js`的部分实现。

## 配置示例

```javascript
import Options from 'api-decorators/resolve-decorator'

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
import apis from 'api-decorators/fetch'
import { DefaultResolve } from 'api-decorators/resolve-decorator'

export default class HomeApis {
  @DefaultResolve
  static sampleApi({ num = 1, size = 2 } = { num: 1, size: 2 }) {
    return apis.get(`sample/api?per_page=${size}&page=${num}`)
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
