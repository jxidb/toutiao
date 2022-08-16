import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '@/router/routes'
// import { getToken } from '@/utils/token'
Vue.use(VueRouter)

// 备份vuerouter原型对象上的push和replace方法
const originPush = VueRouter.prototype.push
const originReplace = VueRouter.prototype.replace

VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    originPush.call(this, location, resolve, reject)
  } else {
    originPush.call(
      this,
      location,
      () => {},
      () => {}
    )
  }
}

VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject)
  } else {
    originReplace.call(
      this,
      location,
      () => {},
      () => {}
    )
  }
}

const router = new VueRouter({
  routes
})

// 路由前置守卫
// 在路由发生真正跳转前，执行该回调函数
// 此函数可以决定我们的路由是否可以跳转/取消/强制中断切换到别的路由
// router.beforeEach((to, from, next) => {
//   if (getToken()?.length > 0 && to.path === '/login') {
//     next(false) // 定在原地不动
//   } else {
//     next()
//   }
// })

export default router
