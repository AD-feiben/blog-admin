let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  // 开发环境
  baseURL = 'http://192.168.3.179:3000'
} else if (process.env.type === 'test') {
  // 测试环境
  baseURL = 'http://172.16.30.128:3000/'
} else {
  // 正式环境
  baseURL = 'localhost:9090'
}

export {
  baseURL
}
