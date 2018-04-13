import Options from './options'

export const Resolves = {
  default: Symbol('default'),
  field: Symbol('field')
}

export function Resolve(type, fieldNames) {
  switch (type) {
    case Resolves.default: return DefaultResolve
    case Resolves.field: return FieldResolve(fieldNames)
    default: return DefaultResolve
  }
}

/**
 * 默认解析修饰器
 */
export function DefaultResolve(target, name, descriptor) {
  const oFunc = descriptor.value
  descriptor.value = function(...args) {
    return oFunc.apply(target, args)
      .then(data => {
        const nData = Options.success(data)
        if (nData) {
          return nData
        } else {
          return Promise.reject(Options.error(data))
        }
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }
  return descriptor
}

/**
 * 字段解析修饰器，提取data中指定的字段，可以是字段数组。
 */
export function FieldResolve(fieldNames = []) {
  return (target, name, descriptor) => {
    const oFunc = descriptor.value
    descriptor.value = function(...args) {
      return oFunc.apply(target, args)
        .then(data => {
          const nData = Options.success(data)
          if (nData) {
            if (typeof fieldNames === 'string') {
              return nData[fieldNames]
            } else if (fieldNames instanceof Array) {
              const obj = {}
              for (fieldName of fieldNames) {
                obj[fieldNames] = nData[fieldName]
              }
              return obj
            } else {
              const error = new Error(`api-decorator [FieldResolve] function: parameter fieldNames must be String or Array, but pass ${typeof fieldNames}`)
              console.error(error)
              return Promise.reject(error)
            }
          } else {
            return Promise.reject(Options.error(data))
          }
        })
        .catch(err => {
          return Promise.reject(err)
        })
    }
    return descriptor
  }
}

export const ContentResolve = FieldResolve('content')
export const ValuesResolve = FieldResolve('values')
export const ItemsResolve = FieldResolve('items')
