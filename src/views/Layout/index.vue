<template>
  <div>
    <div class="home_container">
      <!-- 路由缓存 -->
      <keep-alive>
    <router-view></router-view>
      </keep-alive>
    </div>
    <div>
      <van-tabbar route v-model="active">
        <van-tabbar-item to="/layout/home" icon="home-o">首页</van-tabbar-item>

        <van-tabbar-item to="/layout/user" icon="setting-o">我的</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LayOut',
  data () {
    return {
      active: 0
    }
  }
}
</script>
<style lang="less">
.home_container{
  padding-bottom: 50px;
}
.van-tabbar{
  border-top: 1px solid #f8f8f8;
}
</style>
