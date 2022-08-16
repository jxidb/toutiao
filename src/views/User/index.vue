<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="$store.state.userphoto" alt="" class="avatar">
        </template>
        <template #title>
          <span class="username">{{UserList.name}}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{UserList.art_count}}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{UserList.follow_count}}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{UserList.fans_count}}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link to="/useredit"/>
      <van-cell icon="chat-o" title="小思同学" is-link to="/chat"/>
      <van-cell icon="warning-o" title="退出登录" is-link @click="loginout"/>
    </van-cell-group>
  </div>
</template>

<script>
import { delToken } from '@/utils/token.js'
import { Dialog } from 'vant'
import Notify from '@/ui/Notify.js'
import { mapMutations } from 'vuex'
export default {
  name: 'Us-er',
  data () {
    return {
      UserList: {}
    }
  },
  async created () {
    const res = await this.$API.reqGetUser()
    this.UserList = res.data
    // 直接调用commit触发mutations中的SER_USERPHOTO事件
    // this.$store.commit('SER_USERPHOTO', res.data.photo)
    // 通过vuex的内置方法，将Mutations中的方法映射出来，直接调用方法
    this.SER_USERPHOTO(res.data.photo)
  },
  methods: {
    // 退出登录方法
    loginout () {
      Dialog({
        message: '确认退出吗？',
        showConfirmButton: true,
        showCancelButton: true
      }).then((res) => {
        // 点击确认的回调函数
        delToken()
        Notify({
          type: 'danger',
          message: '退出成功'
        })
        this.$router.replace('/layout/home')
      }, (err) => {
        // 点击取消的回调函数
        console.log(err)
      })
    },
    ...mapMutations(['SER_USERPHOTO'])
  }
}
</script>

<style scoped lang="less">
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #007bff;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>
