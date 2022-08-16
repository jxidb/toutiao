// Vue中全局指令的封装文件
// directive表示的是全局注册自定是指令，指令名叫fofo  用v-fofo使用
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
}

export default directiveObj
