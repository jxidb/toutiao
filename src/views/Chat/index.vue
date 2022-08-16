<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小思同学"></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div v-for="(item,index) in list" :key="index">
          <!-- 左侧是机器人小思 -->
          <div class="chat-item left" v-if="item.name!=='me'">
            <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
            <div class="chat-pao">{{item.msg}}</div>
          </div>

          <!-- 右侧是当前用户 -->
          <div class="chat-item right" v-else>
            <div class="chat-pao">{{item.msg}}</div>
            <van-image fit="cover" round :src="$store.state.userphoto" />
          </div>
       </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="word"  placeholder="说点什么...">
        <template #button>
          <span  style="font-size:12px;color:#999" @click="sendFn">提交</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
// 导入 socket.io-client 包
import { io } from 'socket.io-client'
import { getToken } from '@/utils/token'
export default {
  name: 'Ch-at',
  data () {
    return {
      word: '', // 输入框的内容
      list: [
        // 所有的聊天消息
        // 只根据 name 属性，即可判断出这个消息应该渲染到左侧还是右侧
        { name: 'xs', msg: 'hi，你好！我是小思' },
        { name: 'me', msg: '我是编程小王子' }
      ],
      // 这个就是客户端和服务器链接的socket对象
      // 这个socket就可以接收和发生服务器端的数据了
      socket: null
    }
  },
  created () {
    // 注意：io是建立socket连接，和axios没有关系
    this.socket = io('http://geek.itheima.net', {
      query: {
        token: getToken()
      },
      transports: ['websocket']
    })

    // 给socket绑定一个connect事件，这个事件是内置的，  如果这个事件触发，就代表连接成功
    // this.socket.on('connect', () => {
    //   console.log(11)
    // })

    // 给socket绑定一个message的事件，并传递一个回调，如果触发这个事件，就执行回调函数，data这里的data是后端返回回来的数据
    this.socket.on('message', (data) => {
      // 根据后端返回回来的数据
      this.list.push({
        // 这个是接收数据，name就是xs
        // 立刻组织往list中追加相同的字段->v-for更新->页面更新
        name: 'xs',
        msg: data.msg
      })
    })
  },
  methods: {
    sendFn () {
      if (this.word.trim().length === 0) return
      // 触发后台里面的message事件，并传递一个对象过去
      this.socket.emit('message', {
        msg: this.word,
        timestamp: new Date().getTime()
      })
      this.list.push({
        name: 'me',
        msg: this.word
      })

      this.word = ''
    }
  },
  destroyed () {
    this.socket.close()
    this.socket = null
  },
  watch: {
    deep: true,
    list: {
      handler () {
      // 表示选中chat-list>div表示的是选中chat-list中的直系div
      // div:last-child表示选中这个div中额最后一个子元素
      // 这里因为DOM更新是一个异步的过程，在数据回来之前，还获取不到最后一个div，所以需要用一个定时器，或者$nextTick

        // $nextTick表示在下一个DOM更新结束之后，再执行回调，可以获取到最新的DOM数据，
        this.$nextTick(() => {
          const theDiv = document.querySelector('.chat-list>div:last-child')
          theDiv.scrollIntoView({
            behavior: 'smooth'
          })
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: '';
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
