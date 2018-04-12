export class ApiResultError extends Error {
  code = -1
  origin = {}
  constructor(code, message, origin) {
    super(message)
    this.code = code
    this.origin = origin
  }
}

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

function isSuccess(data) {
  return data.status === 200
}

/**
 * 默认解析修饰器
 */
export function DefaultResolve(target, name, descriptor) {
  const oFunc = descriptor.value
  descriptor.value = function(...args) {
    return new Promise((resolve, reject) => {
      oFunc.apply(target, args)
        .then(data => {
          if (isSuccess(data)) {
            resolve(data.data)
          } else {
            reject(new ApiResultError(data.code, data.message, data))
          }
        })
        .catch(err => {
          reject(err)
        })
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
      return new Promise((resolve, reject) => {
        oFunc.apply(target, args)
          .then(data => {
            if (isSuccess(data)) {
              if (typeof fieldNames === 'string') resolve(data.data[fieldNames])
              else if (fieldNames instanceof Array) {
                const obj = {}
                for (fieldName of fieldNames) {
                  obj[fieldNames] = data.data[fieldName]
                }
                resolve(obj)
              } else {
                const error = new Error(`FieldResolve function: parameter fieldNames must be String or Array, but pass ${typeof fieldNames}`)
                console.error(error)
                reject(error)
              }
            } else {
              reject(new ApiResultError(data.code, data.message, data))
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    }
    return descriptor
  }
}

export const ContentResolve = FieldResolve('content')
export const ValuesResolve = FieldResolve('values')
export const ItemsResolve = FieldResolve('items')
