<template>
    <div>
      <!-- 搜索结果页-头部导航 -->
      <div class="search-result-container">
        <!-- 点击实现后退效果 -->
        <van-nav-bar
          title="搜索结果"
          left-arrow
          @click-left="$router.go(-1)"
          fixed
        />
      </div>

      <!-- 文章列表 -->
      <div>
        <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  @load="onLoad"
  :immediate-check="false"
  offset="50"
>
      <ArticleItem @click.native="ArticleClick(item.art_id)"  :isShow="false" :obj="item" v-for="item in articleList" :key="item.art_id"></ArticleItem>
        </van-list>
      </div>
    </div>
</template>

<script>
import ArticleItem from '@/components/ArticleItm.vue'
// 图片请求404：图片的地址是第三方的，人家把图片地址修改或者删除了，就不能用了
// 404：无法解决，只能给用户提示，用vant组件库中的image组件
// 403：无权请求此图片的地址->别人后端做了防盗链
// 403如何实现的：后端会判断请求中reffer字段的来源是否是自己的地址
// 如何解决图片403：1. - 在index.html中, 添加meta信息, 不携带referrer给第三方服务器
//  - 但是如果他们做了其他判断, 我们依旧拿不到此图片

export default {
  name: 'SearchResult',
  data () {
    return {
      page: 1,
      articleList: [],
      loading: false,
      finished: false
    }
  },
  components: {
    ArticleItem
  },
  async created () {
    const result = await this.$API.reqSearch({
      page: this.page,
      q: this.$route.params.kw
    })
    this.articleList = result.data.results
  },
  methods: {
    // 底部加载文章
    async onLoad () {
      if (this.articleList.length > 0) {
        this.page++
        const result = await this.$API.reqSearch({
          page: this.page,
          q: this.$route.params.kw
        })

        // 判断：如果返回回来的数据中，已经没有文章数据，就表示已经到底  就直接返回，不需要再合并
        if (result.data.results.length === 0) {
          this.finished = true
          return
        }

        this.articleList = [...this.articleList, ...result.data.results]
        this.loading = false
      }
    },
    ArticleClick (id) {
      this.$router.push({
        path: `/articledetail?art_id=${id}`
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
