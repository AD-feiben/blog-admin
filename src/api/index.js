import Vue from 'vue'
const api = {
  article: '/article', // 获取文章列表
  saveArticle: '/saveArticle', // 保存文章
  classify: '/classify', // 查询所有分类
  tags: '/tags', // 查询所有标签
  setState: '/setState', // 设置文章状态
  deleteArticle: '/deleteArticle', // 删除文章
  user: '/user', // 查询是否存在用户
  register: '/register', // 注册用户
  login: '/login', // 登录
  updatePwd: '/updatePwd' // 修改密码
}

Vue.prototype.$api = api
