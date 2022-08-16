<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon name="arrow-left" color="white" size="0.48rem" class="goback" @click="$router.back()" />
      <!-- 搜索组件 -->
      <van-search @search="searchFn" v-model.trim="kw" @input="inputFn" v-fofo placeholder="请输入搜索关键词" background="#007BFF" shape="round" />
    </div>

    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw.length!==0">
      <div class="sugg-item" v-for="(item,index) in suggestList" :key="index" v-html="lightFn(item,kw)" @click="suggestClick(item)">
        <!-- 插值表达式{{}} 不能解析标签样式等 -->
        <!-- v-html可以解析标签样式 但是会覆盖原本的文本 v-html会将其当html标签解析后输出。-->
        <!-- v-text输出的是纯文本  用于将数据填充到标签中，作用于插值表达式类似，但是没有闪动问题  -->
      </div>

    </div>

    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon @click="clearFn" name="delete" class="search-icon" />
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span @click="historyClick(item)" class="history-item" v-for="(item,index) in history" :key="index">{{item}}</span>
      </div>
    </div>

  </div>
</template>

<script>
// 跳转搜索结果页
// 目标1：输入框回车->输入框子->搜索结果页
// 2：点击联想菜单->点击文字->搜索结果页
// 3.点击历史菜单->点击文字->搜索结果页
import { getStorage, setStroage } from '@/utils/storage.js'
export default {
  name: 'Sea-rch',
  data () {
    return {
      kw: '', // 搜索关键字
      timer: null,
      // show: true, // 判断历史记录是否应该显示
      suggestList: [], // 搜索联想建议
      // 如果没有找到his，就为空数组
      history: JSON.parse(getStorage('his')) || [] // 搜索历史
    }
  },
  methods: {
    // 联想菜单方法
    inputFn () {
      // 防抖
      // 不能再这个函数里面创建timer  因为每次改变内容，都会重新创建一个新的timer
      // 那就有三个定时器了
      // const timer = null
      if (this.kw.length === 0) {
        // 如果搜索框没有内容，那就不需要联想数据，就置空
        this.suggestList = []
      } else {
        clearTimeout(this.timer)

        this.timer = setTimeout(async () => {
          const result = await this.$API.reqSuggest({ q: this.kw })
          this.suggestList = result.data.options
        }, 1000)
      }

      // 节流
      // 当timer里面有东西时，直接返回
      /*  if (this.timer) { return }

      // 把timer设置为一个定时器
      this.timer = setTimeout(() => {
        // if (this.kw.length === 0) return
        console.log(this.kw)
        // 将timer设置为假，每次执行完timer就将timer设置为假，这样输入内容时，每隔1秒钟，就会设置一个定时器
        this.timer = false
      }, 1000) */
    },
    // 专门高亮搜索关键字的方法
    lightFn (originStr, target) {
      // originStr：表示的时原字符串
      // target表示的是需要替换的字符串
      // 字符串的replace方法，可以替换字符串中的值  第一个参数是被替换的字符串，第二个参数是需要替换的字符串
      // 会返回一个新的字符串
      // replace：替换第一个符合条件的字符
      // replaceAll：替换全部符合条件的字符
      // return originStr.replaceAll(target, `<span style="color:red">${target}</span>`)

      // 如果想再正则中使用变量的话，需要使用正则的实例化对象
      const reg = new RegExp(target, 'ig') // 这里i表示忽略大小写，g表示全局匹配
      return originStr.replace(reg, match => {
        // 这里的match是匹配时，原字符串里的字符
        return `<span style="color:red">${match}</span>`
      })
    },
    // 输入框->搜索事件
    searchFn () {
      // 如果$router给的是一个配置对象，里面path和params，query参数不能一起使用，
      if (this.kw.length > 0) {
        setTimeout(() => {
          this.$router.push({
            path: `/searchresult/${this.kw}`
          })
        }, 0)
        // this.history.push(this.kw)
      }
    },
    // 联想菜单文字点击->搜索页
    suggestClick (item) {
      setTimeout(() => {
        this.$router.push({
          path: `/searchresult/${item}`
        })
      }, 0)
      this.history.push(item)
    },
    // 历史记录文字点击->搜索页
    historyClick (item) {
      setTimeout(() => {
        this.$router.push({
          path: `/searchresult/${item}`
        })
      }, 0)

      this.history.push(item)
    },
    // 清空历史记录方法
    clearFn () {
      this.history = []
    }
  },
  watch: { // 监听器
  // 监听history数据变化，因为history是一个数组，所以需要深度监听
    history: {
      deep: true, // 深度监听
      handler () {
        // 数据去重
        // 将history去重，并返回一个set类型的数据
        const newarr = new Set(this.history)
        //  Array.from方法可以将一个类数组或set对象等，转换为数组
        const arr = Array.from(newarr)
        setStroage('his', JSON.stringify(arr))
      }
    }
  }
}
</script>

<style scoped lang="less">
/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}
</style>
