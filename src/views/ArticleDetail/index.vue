<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />

<!-- 判断：如果articleContent没数据，就显示加载中 -->
<!-- Object.keys(对象)  可以返回一个数组，这个数组里面包含的是这个对象里面所有的属性名 -->
<van-loading color="#1989fa" text-color="#0094ff" v-if="Object.keys(articleContent).length===0">
  文章加载中...
</van-loading>

   <div v-else>
     <!-- 文章信息区域 -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{articleContent.title}}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="articleContent.aut_name" :label="format(articleContent.pubdate)">
        <template #icon>
          <img :src="articleContent.aut_photo" alt="" class="avatar">
        </template>
        <template #default>
          <div>
            <van-button type="info" size="mini" v-if="articleContent.is_followed" @click="followFn(true)">已关注</van-button>
            <van-button icon="plus" type="info" size="mini" plain v-else  @click="followFn(false)"> 关注</van-button>
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="articleContent.content"> </div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <!-- attitude:文章-是否被点赞 -1无态度, 0未点赞, 1点赞, 是当前登录用户对此文章的态度 -->
        <van-button icon="good-job" type="danger" size="small" v-if="articleContent.attitude===1" @click="clikeLikeFn(true)">已点赞</van-button>
        <van-button icon="good-job-o" type="danger" plain size="small" v-else @click="clikeLikeFn(false)">点赞</van-button>
      </div>
    </div>

    <!-- 文章评论区域 -->
    <CommentList></CommentList>

   </div>
  </div>
</template>

<script>
import { timeAgo } from '@/utils/date'
import CommentList from '@/views/ArticleDetail/CommentList.vue'
export default {
  name: 'ArticleDetail',
  data () {
    return {
      articleContent: {} // 文章对象

    }
  },
  components: {
    CommentList
  },
  async created () {
    // 请求文章
    const result = await this.$API.reqArticlesContent({
      id: this.$route.query.art_id
    })
    this.articleContent = result.data
  },
  methods: {
    format: timeAgo,
    // 关注/取关作者
    async  followFn (boolen) {
      if (boolen === true) {
      // 判断：如果boolen为true，表示用户想取关作者
      // 页面效果：如果boolen为true，表示用户想取关，就不显示关注按钮
        this.articleContent.is_followed = false
        await this.$API.reqDisFollow({ id: this.articleContent.aut_id })
      } else {
      // 判断：如果boolen为false，表示用户想关注作者
        this.articleContent.is_followed = true
        await this.$API.reqFollow({ id: this.articleContent.aut_id })
      }
    },

    // 点赞/取消点赞事件
    async  clikeLikeFn (boolen) {
      if (boolen === true) {
        // 用户点在了   已点赞  身上
        // 判断：如果传递进来的参数为true，就表示用户想取消点赞
        // 页面效果：用户点击已点赞按钮，取消点赞，显示点赞按钮
        this.articleContent.attitude = 0
        await this.$API.reqContentUnLike({
          id: this.articleContent.art_id
        })
      } else {
        // 用户点在了  点赞身上
        // 判断：如果传递进来的参数为false，就表示用户想点赞
        // 页面效果：用户点击点赞按钮，显示已点赞按钮
        this.articleContent.attitude = 1
        await this.$API.reqContentLike({
          id: this.articleContent.art_id
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.van-loading{
  padding-top: 46px;
  text-align: center;
}
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
</style>
