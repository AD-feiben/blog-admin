import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: '/admin',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: resolve => { require(['@/views/login'], resolve) }
    },
    {
      path: '/',
      name: 'home',
      component: resolve => { require(['@/views/home'], resolve) },
      redirect: 'articleList',
      children: [
        {
          path: 'articleList',
          name: 'articleList',
          component: resolve => { require(['@/views/articleList'], resolve) }
        },
        {
          path: 'editor',
          name: 'editor',
          component: resolve => { require(['@/views/editor'], resolve) }
        },
        {
          path: 'updatePwd',
          name: 'updatePwd',
          component: resolve => { require(['@/views/updatePwd'], resolve) }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  let token = window.sessionStorage.getItem('token')
  if (to.name !== 'login' && (token === '' || token === 'undefined' || token === null)) {
    next({path: '/login', replace: true})
  } else {
    next()
  }
})

export default router
