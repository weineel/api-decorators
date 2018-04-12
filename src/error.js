
export class ApiResultError extends Error {
  constructor(code, message, origin) {
    super(message)
    this.code = code || -1
    this.origin = origin || {}
  }
}

export class NetError extends Error {
}
