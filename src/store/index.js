import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userphoto: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F17%2F20210717232533_2edcf.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1662971249&t=3b37647f93e9377f6882653cf86c46af'
  },
  getters: {
  },
  mutations: {
    SER_USERPHOTO (state, value) {
      state.userphoto = value
    }
  },
  actions: {
  },
  modules: {
  }
})
