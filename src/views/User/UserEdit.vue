<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="UserEditList.photo" @click="imgClickFn"/>

            <!-- file 选择框 -->
            <!-- 视觉上隐藏，但是还是再DOM树上，还可以触发功能 -->
        <input
               type="file"
               ref="iptFile"
               v-show="false"
               accept="image/*"
               @change="onFileChange"
               />
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="UserEditList.name" @click="changeName"/>
      <van-cell title="生日" is-link :value="UserEditList.birthday" @click="changebirthday"/>
    </van-cell-group>

    <!-- 姓名修改弹窗 -->
    <van-dialog :before-close="beforeClose" v-model="show" title="标题" show-cancel-button>
          <input ref="iptname" type="text" v-model="inputUsername">
</van-dialog>

<van-popup round v-model="datePickerShow" position="bottom" :style="{ height: '50%' }" >
<!-- 时间选择器 -->
<van-datetime-picker
@confirm="confirmDate"
@cancel="cancelDate"
  v-model="currentDate"
  type="date"
  title="选择年月日"
  :min-date="minDate"
  :max-date="maxDate"
/>
</van-popup>

  </div>
</template>

<script>
import Notify from '@/ui/Notify.js'
import { format } from '@/utils/date.js'
import { mapMutations } from 'vuex'
export default {
  name: 'UserEdit',
  data () {
    return {
      UserEditList: {}, // 用户基本资料
      show: false, // 判断修改姓名的弹窗是否出现:
      datePickerShow: false,
      inputUsername: '', // 用户输入的内容
      minDate: new Date(1920, 0, 1), // 最小时间范围
      maxDate: new Date(), // 最大时间范围 就是今天
      currentDate: new Date(2021, 0, 17)// 当前时间
    }
  },
  async created () {
    const res = await this.$API.reqUserEdit()
    this.UserEditList = res.data
  },
  methods: {
    // 图片点击事件（移花接木）点击图片。然后里面的input输入框用原生的js实现点击
    imgClickFn () {
      this.$refs.iptFile.click()
    },
    // 上传头像方法
    async  onFileChange (e) {
      if (e.target.files.length === 0) return // 判断：如果用户没有选择图片，就直接返回
      const theFd = new FormData()
      theFd.append('photo', e.target.files[0]) // 表示往theFd这个FormData类型对象中添加一个键名为photo，值为e.target.files[0]的对象
      //  window.URL.createObjectURL可以将上传的图片转换为临时的url地址，只是前端临时使用
      // const a = window.URL.createObjectURL(e.target.files[0])
      // console.log(a)
      const res = await this.$API.reqUserPhoto(theFd)
      this.UserEditList.photo = res.data.photo
      // 调用方法，将返回回来的头像数据重新更新到vuex中
      this.SER_USERPHOTO(res.data.photo)
    },
    // 修改名字的方法（获取焦点，显示弹窗的输入框）
    changeName () {
      this.show = true
      this.inputUsername = this.UserEditList.name
      // 这里使用this.$refs.iptname不能直接获取到input输入框是因为第一次的时候，输入框还是隐藏的状态，所以获取不到，可以用定时器延迟，就可以获取到了
      setTimeout(() => {
        this.$refs.iptname.focus()
      }, 500)
    },
    // 修改名字的方法（禁止弹出框隐藏）
    async  beforeClose (action, done) {
      if (action === 'confirm') {
        // 表示用户点击的确定按钮，对用户输入的内容进行判断并反馈给后端进行修改
      // 这个正则表示的是从小写字母，大写字母，数字和汉字中随机匹配1-7位字符，如果匹配成功返回true，否则返回false
        const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/

        // 这个就表示如果this.inputUsername里面的字符串符合reg里面的规则，就返回true否则返回false
        if (reg.test(this.inputUsername)) {
          // 这个就表示匹配成功，则成功修改名字
          await this.$API.reqUpdataUserEdit({ name: this.inputUsername })

          // 改完名称以后，直接再页面回显修改后的数据
          this.UserEditList.name = this.inputUsername
          done()
        } else {
        // 匹配不成功，不关闭弹窗，并弹出一个消息提示
          Notify({ type: 'warning', message: '用户名只能说1-7位中英文数字组合' })
          done(false)
        }
      } else {
        // 用户点击的取消
        done()
      }
    },
    // 点击生日的方法
    changebirthday () {
      this.datePickerShow = true // 显示时间选择器
      // 当点击时间选择器的时候，需要将当前资料的生日再时间选择器上显示出来
      // 时间选择器需要的是一个date时间对象
      this.currentDate = new Date(this.UserEditList.birthday)
    },
    // 修改生日方法
    async  confirmDate (value) {
      /** 自己手动写的原生js时间格式
       * const year = value.getFullYear()
      const month = value.getMonth() + 1
      const date = value.getDate()
      const newdate = year + '-' + month + '-' + date

      */
      //  value就是当前选中的时间
      // 对时间进行格式化，变成YYYY-MM-DD的模式
      const newdate = format(value)
      await this.$API.reqUpdataUserEdit({
        // birthday: newdate
        birthday: newdate
      })
      this.UserEditList.birthday = newdate // 将修改后的时间数据回显到前端页面
      this.datePickerShow = false // 隐藏时间选择器
    },
    // 点击取消时间选择器方法
    cancelDate () {
      this.datePickerShow = false// 隐藏时间选择器
    },
    ...mapMutations(['SER_USERPHOTO'])

  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
/deep/ .van-dialog__content{
  text-align: center;
  input{
    outline: none;
    border: none;
    padding: 0;
    text-align: center;
  }
}
</style>
