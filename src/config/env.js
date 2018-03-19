let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  // 开发环境
  baseURL = 'http://192.168.3.179:3000'
  // baseURL = 'http://192.168.2.206:3000'
  // baseURL = 'http://192.168.0.107:3000'
} else if (process.env.type === 'test') {
  // 测试环境
  baseURL = 'localhost:9090'
} else {
  // 正式环境
  baseURL = 'localhost:9090'
}

export {
  baseURL
}
