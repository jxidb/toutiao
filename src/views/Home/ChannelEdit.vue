<template>
  <div>
    <!-- 弹出层的头部区域 -->
    <van-nav-bar title="频道管理">
      <template #right>
        <van-icon  @click="closeFn" name="cross" size="0.37333334rem" color="white"/>
      </template>
    </van-nav-bar>
    <!-- 我的频道 -->
    <div class="my-channel-box">
      <div class="channel-title">
        <span>我的频道
          <span class="small-title">
            点击{{isEdit?"删除":"进入"}}频道
          </span>
        </span>
        <span @click="editFn">{{isEdit?'完成':'编辑'}}</span>
      </div>
      <!-- 我的频道列表 -->
      <van-row type="flex">
        <van-col @click="removeFn(item)" span="6"  v-for="item in UserchannelList" :key="item.id">
          <div class="channel-item van-hairline--surround">
            {{item.name}}
            <!-- 删除的徽标 -->
            <van-badge color="transparent" class="cross-badge" v-show="isEdit&&item.id!==0">
              <template #content>
                <van-icon
                  name="cross"
                  class="badge-icon"
                  color="#cfcfcf"
                  size="0.32rem"
                />
              </template>
            </van-badge>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 更多频道 -->
    <div class="more-channel-box">
      <div class="channel-title">
        <span>点击添加更多频道：</span>
      </div>
      <!-- 更多频道列表 -->
      <van-row type="flex">
        <van-col @click="moreFn(item)" span="6"  v-for="item in unCheckChannelsList" :key="item.id">
          <div class="channel-item van-hairline--surround">{{item.name}}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    unCheckChannelsList: Array,
    UserchannelList: Array
  },
  data () {
    return {
      isEdit: false // 控制编辑频道的x是否显示
    }
  },
  methods: {
    // 编辑的点击事件
    editFn () {
      // 对isEdit进行取反，每次点击都会改变isEdit的值
      this.isEdit = !this.isEdit
    },
    // 频道点击->添加频道事件
    moreFn (obj) {
      if (this.isEdit) {
        this.$emit('addChannelList', obj)
      }
    },
    // 频道点击->删除频道事件
    removeFn (obj) {
      // 当isEdit为真时，是编辑状态，
      if (this.isEdit) {
        if (obj.id !== 0) {
          this.$emit('removeChannels', obj)
        }
      } else {
        this.$emit('enterChannels', obj)
      }
    },
    closeFn () {
      this.$emit('closeEv')
      // 再点击x的时候，直接重置编辑按钮，变为不编辑状态
      // this.isEdit = false
    }
  }
}
</script>

<style scoped lang="less">
.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-header {
  height: 90px;
  background-color: #007bff;
  color: white;
  text-align: center;
  font-size: 14px;
  position: relative;
  .title {
    width: 100%;
    position: absolute;
    bottom: 15px;
  }
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
  }
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 5px;
}

/*删除的微标 */
.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

/*提示文字 */
.small-title {
  font-size: 10px;
  color: gray;
}
</style>
