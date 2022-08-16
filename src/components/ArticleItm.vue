<template>
<div>
  <!-- 一条文章单元格 -->
  <van-cell >
    <!-- 标题区域的插槽 -->
    <template #title>
      <div class="title-box">
        <!-- 标题 -->
        <span>{{obj.title}}</span>
        <!-- 单图 -->
        <img v-if="obj.cover.type===1" class="thumb" v-lazy="obj.cover.images[0]"  alt="">
      </div>
        <!-- 多图 -->
      <div class="thumb-box" v-if="obj.cover.type>1">
        <img v-for="(item,index) in obj.cover.images" :key="index" class="thumb" v-lazy="item"  alt="">

      </div>
    </template>
    <!-- label 区域的插槽 -->
    <template #label>
      <div class="label-box">
        <div>
          <span>{{obj.aut_name}}</span>
          <span>{{obj.comm_count}}评论</span>
          <span>{{formatTime(obj.pubdate)}}</span>
        </div>
        <!-- 反馈按钮 -->
        <van-icon v-if="isShow" name="cross" @click.stop="show=true" />
      </div>
    </template>
  </van-cell>
  <van-action-sheet @close="closeFn" @cancel="cancelFn" :cancel-text="bottomText" get-container="body" v-model="show" :actions="actions" @select="onSelect" />
</div>
</template>

<script>
// 这个表示将@/utils/date.js中的timeAgo单独解构出来
import { timeAgo } from '@/utils/date.js'
import { firstActions, secondActions } from '@/api/report.js'
export default {
  data () {
    return {
      show: false,
      actions: firstActions, // 反馈面板选项的数组
      bottomText: '取消 ' // 底部文字
    }
  },
  props: {
    obj: Object,
    isShow: { // 判断文章列表中右下角的x反馈按钮是否显示
      type: Boolean,
      default: true
    }
  },
  methods: {
    formatTime: timeAgo,
    onSelect (actions, index) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      if (actions.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.bottomText = '返回'
      } else if (actions.name === '不感兴趣') {
        // 子给父传值，   通过$emit触发artId事件，并传递一个参数过去
        this.$emit('artId', this.obj.art_id)
        this.show = false // 无论反馈成功与失败，都让反馈面板隐藏
      } else {
        this.$emit('reportEv', { artId: this.obj.art_id, type: actions.value })
        this.show = false
        this.actions = firstActions
      }
    },
    // 底部按钮（取消，返回）点击事件
    cancelFn () {
      if (this.bottomText === '返回') {
        this.show = true
        this.actions = firstActions
        this.bottomText = '取消'
      }
    },
    // 面板关闭时触发的事件函数
    closeFn () {
      this.actions = firstActions
      this.bottomText = '取消'
    }
  }

}
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span{
    margin: 0 3px;
    &:first-child{
        margin-left: 0;
    }
}

/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
