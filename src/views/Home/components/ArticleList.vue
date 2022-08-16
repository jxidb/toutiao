<template>
  <div>

<!-- 顶部下拉刷新 -->
<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
<!-- immediate-check这个属性表示van-list初始化时，不执行onload事件 -->
    <!-- 底部加载 -->
    <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  @load="onLoad"
  :immediate-check="false"
  offset="50"
>
    <!-- 文章列表 -->
    <ArticleItem @click.native="ArticleClick(item.art_id)" @reportEv="reportFn" @artId="disLike" v-for="item in articleList" :obj="item" :key="item.art_id">

    </ArticleItem>
    </van-list>
</van-pull-refresh>
  </div>
</template>

<script>
// 事件修饰符.native->是给组件内跟标签，绑定原生的click事件
import ArticleItem from '../../../components/ArticleItm.vue'
import Notify from '@/ui/Notify.js'

// 有重复key 的问题
// 原因：是因为刚进入页面的时候，在created里面发送一次请求，然后因为刚进入页面还没有数据，直接触底，就会触发Onload事件，然后再Onload事件中再发送一次请求，  这个两个请求的都是同一条数据，然后再Onload事件里，又把这两次请求回来的数据合并了，所以会有重复key的问题

// 解决方案1：给van-list组件添加immediate-check="false"
// 解决方案2：在onload头部添加一个数据长度的判断。如果数组长度为0，就表示请求的数据没有返回，就直接return
export default {
  data () {
    return {
      articleList: [],
      isLoading: false,
      loading: false,
      finished: false,
      theTime: new Date().getTime() // 用于做分页功能  刚开始请求的是第一页的数据
    }
  },
  props: ['channelid'],
  components: {
    ArticleItem
  },
  async created () {
    // const result = await this.$API.reqgetArticles({ channel_id: this.channelid, timestamp: this.theTime })
    // this.articleList = result.data.results
    // this.theTime = result.data.pre_timestamp

    this.getArticleList()
  },
  methods: {
    // 专门发送获取文章请求的方法
    async  getArticleList () {
      const result = await this.$API.reqgetArticles({ channel_id: this.channelid, timestamp: this.theTime })
      // 运用展开运算符，将articleList和返回的新数据合并
      this.articleList = [...this.articleList, ...result.data.results]
      this.theTime = result.data.pre_timestamp
      this.loading = false //  如果不设置关闭  那底部一直都是转圈圈
      if (result.data.pre_timestamp === null) {
        this.finished = true // 当数据请求完毕，没有更多数据了，就设置为true，表示没有更多
      }
      // 顶部加载完成,将isLoading设置为false,表示加载完成
      this.isLoading = false
    },
    async  onLoad () {
      // 异步更新数据
    /**
     *  if (this.articleList.length === 0) {
       this.loading=false   第一次刚进入页面的时候,还是会触底,会触发onload事件,如果不将loading设置为false,下次触底就不会触发onload事件
       return // 判断：如果当前请求数据没有返回，就直接return出去，不执行请求
      } */
      /**
      * const result = await this.$API.reqgetArticles({ channel_id: this.channelid, timestamp: this.theTime })
      // 判断：如果当前返回的数据中pre_timestamp为空，就表示当前的数据是最后一页

      // 运用展开运算符，将articleList和返回的新数据合并
      this.articleList = [...this.articleList, ...result.data.results]

      this.theTime = result.data.pre_timestamp */
      // immediate-check只是内部不进行判断而已，滚动的代码还在
      // 第一个频道滚动到底部，再切换到第二个频道的时候，因为第二个频道是新建的，内容没有那么高，滚动会从底部滚回到顶部
      // 这个时候发生滚动，滚动事件还是触发，这个时候immediate-check判断就无效
      if (this.articleList.length === 0) {
        this.loading = false
        return
      }
      this.getArticleList()
    },
    // 顶部刷新事件
    async onRefresh () {
      // 将articleList数组清空,然后重新拉取数据
      this.articleList = []
      this.theTime = new Date().getTime()
      // const result = await this.$API.reqgetArticles({ channel_id: this.channelid, timestamp: (new Date()).getTime() })
      // this.articleList = result.data.results
      this.getArticleList()
    },

    // 专门发送不感兴趣的网络请求
    async getdisLike (id) {
      await this.$API.reqdisLike({ target: id })
    },
    // 不感兴趣的方法
    disLike (artid) {
      // 发起网络请求
      // 请求成功顶部消息通知
      this.getdisLike(artid)
      Notify({ type: 'success', message: '反馈成功' })
    },
    // 举报方法
    async   reportFn ({ artId, type }) {
      await this.$API.reqReport({ artId, type })
      Notify({ type: 'success', message: '举报成功' })
    },
    // 文章点击事件->跳转内容详情
    ArticleClick (id) {
      this.$router.push({
        path: `/articledetail?art_id=${id}`
      })
    }

  }
}
</script>
