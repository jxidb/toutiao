<template>
  <div id="app">
    <!-- 路由缓存，exclude表示这些组件不缓存，这后面跟的是组件内name属性的值 -->
<keep-alive exclude="Sea-rch,SearchResult,UserEdit,ArticleDetail">
      <router-view></router-view>

</keep-alive>
  </div>
</template>
<script>
export default {
  name: 'App'

}
</script>
<style lang="less">

</style>
