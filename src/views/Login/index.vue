<template >
  <div>
    <van-nav-bar title="黑马头条-登录" />

    <div>
      <van-form @submit="onSubmit">
        <van-field v-model="user.mobile" required  name="mobile" label="手机号" placeholder="请输入11位手机号" :rules="[{ required: true, message: '请输入正确的手机号',pattern :/^1[3-9]\d{9}$/ }]" />
        <van-field v-model="user.code"  required type="password" name="code" label="密码" placeholder="请输入6位密码" :rules="[{ required: true, message: '请填写密码' ,pattern:/^\d{6}$/}]" />
        <div style="margin: 16px;">
          <van-button round block type="info" :disabled="isLoading" :loading="isLoading"  native-type="submit">提交</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>
<script>
import Notify from '@/ui/Notify.js'
import { setToken } from '@/utils/token'
import { setStroage } from '@/utils/storage.js'
export default {
  name: 'LoGin',
  data () {
    return {
      user: {
        mobile: '13888888888', // 手机号
        code: '246810' // 密码（必须是246810）
      },
      isLoading: false
    }
  },
  methods: {
    async onSubmit () {
      // 点击提交，就将isLoading设置为真
      this.isLoading = true
      try {
        const result = await this.$API.reqLogin(this.user)
        Notify({ type: 'success', message: '登录成功' })
        setToken(result.data.token)
        setStroage('refresh_token', result.data.refresh_token)
        // 登录成功的话，就跳转路由。跳转路由一定要写在最后面->尽量最后执行，因为如何在token还没有设置的时候就跳转的话，因为没有做页面缓存，页面跳转可能就会被释放，token就不会被存储
        console.log(this.$router)
        this.$router.replace({
          path: this.$router.currentRoute.query.path || '/layout/home'
        })
      } catch (error) {
        if (error) {
          Notify({ type: 'danger', message: '验证码或手机号错误' })
        }
      }
      // 网络请求完成，无论成功还是失败，都将加载状态关闭
      this.isLoading = false
    }
  }
}
</script>
<style lang="less" scoped>
// .van-nav-bar{
//   background-color: #007bff;
// }
// /deep/ .van-nav-bar__title{
//   color:white
// }
</style>
