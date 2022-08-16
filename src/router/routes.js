import { getToken } from '@/utils/token'
export default [
  {
    path: '/login',
    component: () => import('@/views/Login'),
    // 路由独享守卫  在进入理由之前（也就是在进入login这个页面之前）会先执行beforeEnter的这个回调函数
    beforeEnter: (to, from, next) => {
      if (getToken()?.length > 0) {
        // 手动修改url地址，next(false)会跳转回from页面
        // 这里就是在进login之前就判断。如果有token，就不跳转
        // 但是使用浏览器后退按钮的话,就又会回到login页面,又会进行判断,所以这里不能写next(false)
        // next(false)

      } else {
        next()
      }
    }
  },
  { path: '/', redirect: '/layout' }, // ，默认打开首页
  {
    path: '/layout',
    redirect: '/layout/home',
    component: () => import('@/views/Layout'),
    children: [
      {
        path: 'home',
        component: () => import('@/views/Home'),
        // 路由元信息  可以给路由添加更多的其他信息
        meta: {
          scrollT: 0
        }
      },
      {
        path: 'user', component: () => import('@/views/User')
      }
    ]
  },
  // 搜索页面路由
  { path: '/search', component: () => import('@/views/Search/index.vue') },
  //  搜索结果路由
  { path: '/searchresult/:kw', component: () => import('@/views/Search/searchresult.vue') },
  // 文章详情页
  { path: '/articledetail', component: () => import('@/views/ArticleDetail/index.vue') },
  //  用户编辑页面
  { path: '/useredit', component: () => import('@/views/User/UserEdit.vue') },
  //  小思同学页面
  { path: '/chat', component: () => import('@/views/Chat/index.vue') }
]
