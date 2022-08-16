import '@/utils/console.js' // 去掉打印语句
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入全部的api接口
import * as API from '@/api'
// 引入flexible的js代码->设置跟标签大小（移动端适配）
import 'amfe-flexible'
// import hljs from 'highlight.js' // hljs对象
import 'highlight.js/styles/default.css' // 代码高亮的样式
import directive from '@/utils/directive'
import './VueComponent.js'
Vue.config.productionTip = false

/* // directive表示的是全局注册自定是指令，指令名叫fofo  用v-fofo使用
// 里面的inserted函数中el就是使用fofo指令的dom元素
// 如果是在组件身上用的话，el就是组件最外面的标签，如果想选中里面的标签的话，可以使用querySelector进行标签选择
// Vue.directive('fofo', {
//   inserted (el) {
//     const input = el.querySelector('input')
//     input.focus()
//   }
// })

// 封装一个插件
const directiveObj = {
  install (Vue) {
    Vue.directive('fofo', {
      // 指令所在标签只有被插入到真是DOM时才会触发inserted，如果用display:none隐藏了标签，是不会再次触发inserted
      inserted (el) {
        // 知识点：原生的DOM.nodeName可以获取到标签的名字（要大写）
        // const input = el.querySelector('input')
        // input.focus()
        // 判断el是什么类型的标签，如果是原生的输入框标签，就直接聚焦
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          setTimeout(() => {
            // 如果不是原生的输入框标签，就尝试在el中获取原生的输入框标签
            const input = el.querySelector('input')
            const textarea = el.querySelector('textarea')
            // 不一定能获取到input和textarea，所以才需要判断
            // 如果input有值，（就是获取到了input） 就聚焦
            if (input) input.focus()
            // 同上
            if (textarea) textarea.focus()
          }, 1000)
        }
      },
      update (el) { // 指令所在标签被更新时触发
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          setTimeout(() => {
            // 如果不是原生的输入框标签，就尝试在el中获取原生的输入框标签
            const input = el.querySelector('input')
            const textarea = el.querySelector('textarea')
            // 不一定能获取到input和textarea，所以才需要判断
            // 如果input有值，（就是获取到了input） 就聚焦
            if (input) input.focus()
            // 同上
            if (textarea) textarea.focus()
          }, 1000)
        }
      }
    })
  }
} */
// 调用Vue.use会执行对象中的install方法
Vue.use(directive)

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate () {
    Vue.prototype.$API = API
    Vue.prototype.$bus = this
  }
}).$mount('#app')

// 在项目打包之后，运行dist文件中的index.html文件的时候。控制台报401错误
// 这是因为index.html运行在5500端口，  在index.html中引入的其他打包文件的路径全是服务器根路径
// index.html运行在5500端口，服务器根路径下根本就没有css和js文件，而是在index.html同级的目录下
// 解决，在项目打包时，引入其他文件以./开头
// 在vue.config.js中添加publicPath:'./'  重新打包
