// vant组件库的使用文件，

import Vue from 'vue'

import { Image, CellGroup, Tag, Search, Row, Col, Badge, Button, Cell, NavBar, Form, Field, Tabbar, TabbarItem, Icon, Tab, Tabs, List, PullRefresh, ActionSheet, Popup, Divider, Dialog, DatetimePicker, Loading, Lazyload } from 'vant'

Vue.config.productionTip = false

Vue.use(Lazyload, {

  loading: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimgs.xueui.cn%2Fwp-content%2Fuploads%2F2016%2F04%2F7-160410220156.jpg&refer=http%3A%2F%2Fimgs.xueui.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663128955&t=f54e5704bf479b663a9c3fba88cf3d04',
  //  屏幕高度的范围0-1  表示预加载的范围是屏幕的80%
  preLoad: 0.9
})
Vue.use(Loading)
// 全局注册
Vue.use(Divider)
Vue.use(Dialog)
Vue.use(DatetimePicker)

Vue.use(CellGroup)
Vue.use(Tag)
Vue.use(Image)

Vue.use(Row)
Vue.use(Search)
Vue.use(Col)
Vue.use(Badge)
Vue.use(Popup)
Vue.use(ActionSheet)
Vue.use(PullRefresh)
Vue.use(List)
Vue.use(Tab)
Vue.use(Cell)
Vue.use(Tabs)
Vue.use(Icon)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Button)
Vue.use(NavBar)
Vue.use(Form)
Vue.use(Field)
