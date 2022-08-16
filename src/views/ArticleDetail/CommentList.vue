<template>
  <div>

<!-- 评论区域 -->
    <div class="cmt-list">
      <!-- 评论的 Item 项 -->
      <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  @load="onLoad"
  :immediate-check="false"
>
      <div class="cmt-item" v-for="obj in commentlist" :key="obj.com_id">
        <!-- 头部区域 -->
        <div class="cmt-header">
          <!-- 头部左侧 -->
          <div class="cmt-header-left">
            <img :src="obj.aut_photo" alt="" class="avatar">
            <span class="uname">{{obj.aut_name}}</span>
          </div>
          <!-- 头部右侧 -->
          <div class="cmt-header-right">
            <van-icon name="like" size="16" color="red" v-if="obj.is_liking" @click="isLikeFn(true,obj)" />
            <van-icon name="like-o" size="16" color="gray" v-else @click="isLikeFn(false,obj)" />
          </div>
        </div>
        <!-- 主体区域 -->
        <div class="cmt-body">
          {{obj.content}}
        </div>
        <!-- 尾部区域 -->
        <div class="cmt-footer">{{format(obj.pubdate)}}</div>
      </div>
      </van-list>
    </div>

<!-- 发布评论区域 -->
    <div class="comment" :class="{'art-cmt-container-1':isShowCmtInput,'art-cmt-container-2':!isShowCmtInput}">
      <!-- 底部添加评论区域(短的) - 1 -->
      <div class="add-cmt-box van-hairline--top" v-if="isShowCmtInput===true">
        <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
        <div class="ipt-cmt-div" @click="toggleShowFn">发表评论</div>
        <div class="icon-box">
          <van-badge>
            <van-icon name="comment-o" @click="scrollClickFn" :badge="commCount?commCount:''" max="99+" size="0.53333334rem" />
          </van-badge>
          <van-icon name="star-o" size="0.53333334rem" />
          <van-icon name="share-o" size="0.53333334rem" />
        </div>
      </div>

      <!-- 底部添加评论区域（长的） - 2 -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea placeholder="友善评论、理性发言、阳光心灵" v-model.trim="comValue"  v-fofo @blur="loseFocus" ></textarea>
        <van-button type="default" :disabled="comValue.length===0" @click="sendFn">发布</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { timeAgo } from '@/utils/date'
export default {
  data () {
    return {
      offect: null, // 偏移量的评论id
      commentlist: [], // 评论列表数据
      isShowCmtInput: true, // 控制底部评论面板显示的是长的还是短的
      comValue: '', // 绑定的是文本输入框内容
      loading: false,
      finished: false,
      commCount: null// 评论的总条数
    }
  },

  async created () {
    // 获取评论列表
    const res = await this.$API.reqComment({
      source: this.$route.query.art_id
    })
    this.commCount = res.data.total_count // 评论的总条数
    this.offect = res.data.last_id
    this.commentlist = res.data.results
    if (res.data.results.length === 0) {
      this.finished = true
    }
  },
  methods: {
    format: timeAgo,
    // 评论点赞/取消点赞方法
    async isLikeFn (boolen, obj) {
      if (boolen === true) {
        // 判断：如果点击的是红心，表示的是用户想取消点赞
        // 页面：点击红心，显示灰色未点赞按钮
        obj.is_liking = false
        await this.$API.reqCommentUnLike({ id: obj.com_id })
      } else {
        // 判断：如果点击的是灰色心，表示的是用户想点赞
        // 页面：点击的灰色，就显示 红心已点赞按钮
        obj.is_liking = true
        await this.$API.reqCommentLike({ id: obj.com_id })
      }
    },
    // 显示评论栏方法
    toggleShowFn () {
      this.isShowCmtInput = false
    },
    // 点击徽标，立马滑动到评论区
    scrollClickFn () {
      // 在这里可以直接使用document.querySelector获取其他组件的dom原生标签元素，这是因为js是在html和css执行完以后才会执行的，这个时候可以在Dom上获取到节点元素
      // const articleHeight = document.querySelector('.article-container').scrollHeight
      // //  window.scrollTo表示的是可以使页面进行滚动，设置相应的坐标，就可以让滚动到该坐标滚动到页面的顶部，
      // window.scrollTo(0, articleHeight)

      // 比较方便的方法
      // scrollIntoView（既能滚动，也能带动画）
      // scrollIntoView由原生的标签来使用
      // 使用方法：原生标签.scrollIntoView({})里面是一个配置对象
      // scrollIntoView的效果就是让前面调用的原生标签滚动到屏幕的最上面（可以被fixed的元素挡住）
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })

      // js动画
      // 获取当前页面已经滚动的距离
      // const alsoscroll = window.scrollY
      // 获取文章的高度,表示要滚动的距离
      // const dist = document.querySelector('.article-container').scrollHeight

      // 每次滚动的距离  因为文章的高度是固定的,所以步长也是固定的
      // const step = dist / 10

      // 这一个是表示每走一次,剩余的距离就小一些,滚动的就慢一些,
      // const step = (dist - alsoscroll) / 10
      // setTimeout(() => {
      //   if (dist < alsoscroll + step) {
      //     return
      //   }

      //   //  if (step < 1) { 判断是否滚动结束
      //   //        window.scrollTo(0, dist)     动画停止了, 把文章高度设置为卷入值(精度对准)
      //   // return
      //   //     }

      //   //
      //   window.scrollTo(0, alsoscroll + step)
      //   this.scrollClickFn()
      // }, 100)
    },
    // 失去焦点，延迟触发v-if事件
    // 因为点击发布会失去焦点，失去焦点就会销毁发布的标签，所以需要失焦
    // 原因：点击发布按钮的一瞬间失去焦点，被v-if和v-else移除了标签，所以不能触发点击事件
    loseFocus () {
      setTimeout(() => {
        this.isShowCmtInput = true
      }, 0)
    },
    // 点击发布按钮发布评论方法
    async sendFn () {
      const res = await this.$API.reqAddComments({
        target: this.$route.query.art_id,
        content: this.comValue
      })
      this.commentlist.unshift(res.data.new_obj)
      this.commCount++
      this.comValue = ''
      this.scrollClickFn()
    },
    // 下拉加载更多
    async onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      if (this.commentlist.length > 0) {
        const res = await this.$API.reqComment({
          source: this.$route.query.art_id,
          offset: this.offect
        })
        //  分页，将新返回回来的last_id作为下一次请求的id
        this.offect = res.data.last_id
        // 判断：如果文章的最后一个id和返回回来本次评论列表最后一个id相同，就代表数据已经请求完毕，就表示没有下一页
        if (res.data.last_id === res.data.end_id) {
          this.finished = true
        }
        // 将返回回来的数组和原本的数组进行合并
        this.commentlist = [...this.commentlist, ...res.data.results]
        // 表示数据更新完毕
        this.loading = false
      } else {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-top: 46px;
}
.art-cmt-container-2 {
  padding-top: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
</style>
