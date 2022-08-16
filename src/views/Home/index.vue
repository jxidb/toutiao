<template>
  <div>
    <div>
      <van-nav-bar fixed>
        <template #right>
          <van-icon @click="searchFn" name="search" color="white" size="0.48rem" />
        </template>

        <template #left>
          <img class="logo" src="@/assets/logo.png" alt="">
        </template>

      </van-nav-bar>
    </div>

    <!-- tab导航栏 -->
    <div class="main">
      <van-tabs @change="channelChangeFn" animated  v-model="activeName"  sticky offset-top="1.226667rem">
        <van-tab  :name="item.name" :title="item.name" v-for="item in UserchannelList" :key="item.id">
<ArticleList :channelid="item.id" ></ArticleList>
        </van-tab>

      </van-tabs>

      <!-- 编辑频道图标 -->
<van-icon name="plus" @click="pulsClickFn" size="0.37333334rem" class="moreChannels"/>
    </div>
    <!-- 频道管理弹出层 -->
    <van-popup v-model="show" class="channel_poup" get-container="body">
      <ChannelEdit
      @removeChannels="removeChannels"
      @addChannelList="addChannelList"
      @closeEv="closeFn"
      @enterChannels="enterChannels"
      ref="closeRef"
      :UserchannelList="UserchannelList" :unCheckChannelsList="unCheckChannelsList"></ChannelEdit>
    </van-popup>
  </div>
</template>
<script>
import ArticleList from '@/views/Home/components/ArticleList.vue'
import ChannelEdit from '@/views/Home/ChannelEdit.vue'
export default {
  name: 'Ho-me',
  data () {
    return {
      activeName: '推荐', // 默认选中的频道
      UserchannelList: [], // 用户选择频道列表
      allChannelList: [], // 所有频道列表
      show: false, // 频道弹出层显示或隐藏
      channelsScroll: {} // 每个频道滚动的距离
    }
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  async  created () {
    // 用户选择列表
    const result = await this.$API.reqgetUserChannels()
    this.UserchannelList = result.data.channels
    // this.channelid = result.data.channels.id
    // 所有频道列表
    const res = await this.$API.reqGetAllChannelsApi()
    this.allChannelList = res.data.channels
  },
  methods: {
    pulsClickFn () {
      this.show = true
    },

    // 添加频道方法
    async getChannelsList (obj) {
      this.UserchannelList.push(obj)
      // w为什么只用push，下面的更多频道直接自己就删除，
      // 因为计算属性会自动计算数据，如果用户频道发生改变，计算属性会重新计算，然后重新渲染数据

      // 如果后台要的数据有要求的话，还需要对数组进行过滤

      // 这是将推荐频道筛选出来，因为推荐频道不用进行更新或删除等操作
      // 这里筛选出来的newArr里面的数据其实还是UserchannelList里面的数据，地址是一样的，所以修改newArr的数据，UserchannelList的数据也会修改
      const newArr = this.UserchannelList.filter((item) => item.id !== 0)
      const theNewArr = newArr.map((obj, index) => {
        // 将每个对象重新赋值给newObj  这样newObj就是一个新的对象，
        const newObj = { ...obj } // 浅拷贝 用展开运算符拷贝的话，那修改单纯的对象，可以独立修改
        delete newObj.name
        newObj.seq = index
        return newObj // 让map方法把新对象收集起来形成一个新数组
      })
      // 发起请求
      const result = await this.$API.reqSetChannels({
        // channels: this.UserchannelList
        channels: theNewArr
      })
      console.log(result)
    },
    // 添加频道方法
    addChannelList (obj) {
      this.getChannelsList(obj)
    },
    // 删除频道方法
    async   removeChannels (obj) {
      // 找到点击频道的索引
      const index = this.UserchannelList.findIndex((item) =>
        item.id === obj.id
      )
      // 将点击的频道从UserchannelList中删除
      this.UserchannelList.splice(index, 1)

      // 将数据更新到后端
      const result = await this.$API.reqSetChannels({
        channels: this.UserchannelList

      })
      console.log(result)
    },
    closeFn () {
      // 隐藏弹出层面板
      this.show = false
      // 通过给组件添加ref属性，可以获取到该组件的实例，就可以调用该组件中的方法修改组件中的数据等
      this.$refs.closeRef.isEdit = false
    },
    // 进入频道
    enterChannels (obj) {
      this.show = false
      // 通过给van-tab设置name属性，来控制当前选中的是哪一个标题
      this.activeName = obj.name
    },
    // 点击按钮进入搜索页面
    searchFn () {
      this.$router.push('/search')
    },
    // 监听页面滚动的方法
    scrollFn () {
      this.$route.meta.scrollT = document.documentElement.scrollTop || document.body.scrollTop
      // tab被切换后height会被设置为0，再切回来，高度为0，滚动位置从底部回到顶部，滚动事件触发
      // 因为是顶部，scrollTop为0，所以又重新赋值为0
      this.channelsScroll[this.activeName] = document.documentElement.scrollTop || document.body.scrollTop
    },

    // 频道改变时，设置滚动条的方法
    channelChangeFn () {
      // tab切换后，设置滚动条的为位置
      // 在这个组件内部，当tab栏切换走时，会将切换的这一栏的height设置为0
      // height为0之后，你再切回来，还是会触发滚动事件，这个时候从底部到顶部，滚动事件被触发
      // 重新设置了scrollTop，所以需要在dom更新完成以后再设置滚动的高度
      this.$nextTick(() => {
        document.documentElement.scrollTop = this.channelsScroll[this.activeName]
        document.body.scrollTop = this.channelsScroll[this.activeName]
      })
    }

  },
  computed: {
    unCheckChannelsList () {
    /*   // 对所有频道进行过滤
      return this.allChannelList.filter(bigobj => {
        // 对用户频道进行筛选，如果用户频道里的对象和所有频道里的对象一致，那就不能要
        // findIndex返回符合函数体的第一个元素索引
        const index = this.UserchannelList.findIndex(smallobj => {
          return smallobj.id === bigobj.id
        })

        // 如果index等于-1的话，那就表示没有在没有找到该元素  如果不等于-1，那就表示找到了该元素
        if (index > -1) {
          return false
        } else {
          return true
        }
      }) */

      // 数组过滤的简化写法
      // 这里表示在filter中再进行数组查找，findIndex函数体表示查找元素的条件，如果找到了该元素，就返回该元素的索引，没找到就返回-1
      return this.allChannelList.filter((bigobj) => this.UserchannelList.findIndex(smallobj => smallobj.id === bigobj.id) === -1)
    }
  },
  activated () {
    window.addEventListener('scroll', this.scrollFn)
    //  document.documentElement选中的是文档中的html根标签
    document.documentElement.scrollTop = this.$route.meta.scrollT
  },
  deactivated () {
    window.removeEventListener('scroll', this.scrollFn)
  }
}
</script>
<style lang="less">
.logo {
  width: 100px;
  height: 30px;
}
.main{
  padding-top: 46px;
}
// 设置 tabs 容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 60px;
  right: 8px;
  z-index: 999;
  background-color: #fff;
}

.channel_poup{
  height: 100vh;
  width: 100vw;
}
</style>
