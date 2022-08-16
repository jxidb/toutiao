import axios from 'axios'
import nprogress from 'nprogress'
// 引入进度条的样式   如果进度条没有显示，那可能就是没有引入样式
import 'nprogress/nprogress.css'
import router from '@/router/index.js'
import Notify from '@/ui/Notify.js'
// import { getToken, delToken } from '@/utils/token.js'
import { getToken, setToken, delToken } from '@/utils/token.js'
import { reqRefreshToken } from '@/api/index'

// 表示既引入@/api/index.js里面的数据,又导出@/api/index.js里面的数据
export * from '@/api/index.js'

const requests = axios.create({
/*  1. 这里的baseURL的地址会拼接在每一个请  求的前面这里如果只写一个/api就表  示baseUrl是127.0.0.1/api

  所以在打包项目的时候，这里必须要写完整的请求地址
   在开发环境可以写简写的，因为开发环境用到了proxy代理。如果请求的地址中包含了/api就会转发这个请求到代理的目标地址去，

  但是开发环境和生产环境是不一样的，开发环境的proxy代理不能在生产环境使用，所以如果打包的话，需要填写完整的请求地址
  baseURL: 'http://geek.itheima.net/v1_0', */
  baseURL: '/v1_0',
  timeout: 5000
})

// 请求拦截器
requests.interceptors.request.use((config) => {
  nprogress.start()
  // 目标：同意携带token
  // 判断本地有token再携带，判断网络请求中如果没有携带Authorization，我再添加
  // ?.表示可选链操作符，表示的是如果前面对象没有数据，也就没有length属性，整个表达式返回undefined
  // 如果getToken获取到了值，才能调用length方法
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
  //  请求判断，如果没有有token，并且Authorization没有字段，才会同意添加
  // 如果Authorization有字段，就不生效
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
})

// 响应拦截器
requests.interceptors.response.use((res) => {
  nprogress.done()
  return res.data
}, async (err) => {
  // 当请求返回状态码为4xx 5xx时，会进入这里
  if (err.response.status === 401) {
    // 这里不能直接使用this.$router.push，因为这里的this指向有问题，在Vue页面中，this指向的是一个vue的实例，只有在实例身上才会找到$router这个属性  而这里的this是undefined
    // 可以直接引入router的实例，然后通过实例进行跳转
    // this.$router.push('/login')

    // 方式1：清空token，重新登录，用户有感知，体验不好
    /*  delToken() // 退出登录需要先清空token，这样路由守卫才能判断进行放行
    router.replace('/login') */

    // 调用刷新token 的接口
    const res = await reqRefreshToken()
    // 1.刷新token之后，将返回的新的token进行本地存储
    console.log(res)
    setToken(res.data.token)
    // 2.还要将新的token更新在请求头里
    err.config.headers.Authorization = `Bearer ${res.data.token}`
    // 3.将未完成这一次请求，再次发起
    // err.config就是上一次请求的配置对象
    // 请求的结果我们要return回原本逻辑页面调用的地方  还是return回去一个promise对象
    return axios(err.config)
  } else if (err.response.status === 500 && err.config.url === '/authorizations' && err.config.method === 'put') {
    // 刷新的refresh_token失效
    // 这个时候就要重新登录
    Notify({ type: 'warning', message: '登录已过期' })
    // 清除token
    delToken()
    // 返回登录页
    router.replace({
      path: `/login?path=${router.currentRoute.fullPath}`
    })
  } else if (err.response.status === 500) {
    console.log(err)
    // router.currentRoute就相当于是vue中的this.$router，都是拿到路由的信息
    // fullPath表示的是都是拿到当前路径信息
  }

  return Promise.reject(new Error(err))
})

// 给axios重新包裹一层函数，这样的话，如果后期需要更换成jquery的ajax请求的话，直接再这里修改就可以了
export default ({ url, method = 'GET', params = {}, data = {}, headers = {} }) => {
  return requests({
    url,
    method,
    params,
    data,
    headers
  })
}
